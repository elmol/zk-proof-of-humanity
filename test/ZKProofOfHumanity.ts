import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { FullProof, generateProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { run } from "hardhat"
import { ProofOfHumanityMock, ZKProofOfHumanity } from "../build/typechain"
import { config } from "../package.json"
import { ethers } from "hardhat"

class ZkPoHApi {
    public readonly groupId = "42"

    private _identities: Identity[] = []
    private _group = new Group(this.groupId)

    public readonly wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
    public readonly zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

    public addIdentity(identity: Identity) {
        this._identities.push(identity)
        this._group.addMember(identity.commitment)
    }

    public async generateHumanityProofByIdentity(
        groupId: string,
        identity: Identity,
        group: Group,
        wasmFilePath: string,
        zkeyFilePath: string
    ) {
        const signal = groupId
        const externalNullifier = groupId
        return await generateProof(identity, group, externalNullifier, signal, {
            wasmFilePath,
            zkeyFilePath
        })
    }

    public get group() {
        return this._group
    }

    public get identities() {
        return this._identities
    }
}

describe("ZKProofOfHumanity", () => {
    let zkPoHContract: ZKProofOfHumanity
    let pohContract: ProofOfHumanityMock

    const api = new ZkPoHApi()
    const groupId = api.groupId
    const wasmFilePath = api.wasmFilePath
    const zkeyFilePath = api.zkeyFilePath

    before(async () => {
        // contracts deployment
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        pohContract = await PoHFactory.deploy()
        zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: groupId })

        api.addIdentity(new Identity())
        api.addIdentity(new Identity())
    })

    describe("# register", () => {
        it("Should allow humans (registered accounts in poh) to register in zk-poh", async () => {
            const [owner, human1, human2] = await ethers.getSigners()

            await pohContract.addSubmissionManually(human1.address)
            const tx = zkPoHContract.connect(human1).register(api.group.members[0])
            await expect(tx).to.emit(zkPoHContract, "NewUser").withArgs(api.group.members[0], human1.address)

            await pohContract.addSubmissionManually(human2.address)
            const tx1 = zkPoHContract.connect(human2).register(api.group.members[1])
            await expect(tx1).to.emit(zkPoHContract, "NewUser").withArgs(api.group.members[1], human2.address)
        })

        it("Should not allow same identity to register in zk-poh twice", async () => {
            const [owner, human1, human2, human3] = await ethers.getSigners()
            await pohContract.addSubmissionManually(human3.address)
            const identityCommitment = api.group.members[0]
            const transaction = zkPoHContract.connect(human3).register(identityCommitment)
            await expect(transaction).to.be.revertedWithCustomError(zkPoHContract, "ZKPoH__AccountAlreadyExists")
        })

        it("Should not allow same human to register in zk-poh twice with different identity", async () => {
            const [owner, human1] = await ethers.getSigners()
            const identity = new Identity()
            const identityCommitment = identity.commitment
            const transaction = zkPoHContract.connect(human1).register(identityCommitment)
            await expect(transaction).to.be.revertedWithCustomError(zkPoHContract, "ZKPoH__AccountAlreadyExists")
        })

        it("Should not allow to register an account if it is not in registered in PoH", async () => {
            const [owner, human1, human2, human3, notPoHRegisteredSigner] = await ethers.getSigners()
            const identity = new Identity()
            const identityCommitment = identity.commitment
            const transaction = zkPoHContract.connect(notPoHRegisteredSigner).register(identityCommitment)
            await expect(transaction).to.be.revertedWithCustomError(zkPoHContract, "ZKPoH__AccountNotRegisteredInPoH")
        })
    })

    describe("# verifyProof", () => {
        let fullProof: FullProof
        const signal = formatBytes32String("Hello World")
        const externalNullifier = groupId

        before(async () => {
            fullProof = await generateProof(api.identities[1], api.group, externalNullifier, signal, {
                wasmFilePath,
                zkeyFilePath
            })
        })

        it("Should allow users to signal anonymously", async () => {
            const transaction = zkPoHContract.verifyProof(
                fullProof.merkleTreeRoot,
                signal,
                fullProof.nullifierHash,
                externalNullifier,
                fullProof.proof
            )

            await expect(transaction).to.emit(zkPoHContract, "HumanProofVerified").withArgs(signal)
        })

        it("Should not allow users to double-signal", async () => {
            const transaction = zkPoHContract.verifyProof(
                fullProof.merkleTreeRoot,
                signal,
                fullProof.nullifierHash,
                externalNullifier,
                fullProof.proof
            )
            await expect(transaction).to.be.rejected
        })
    })

    describe("# verifyHumanity", () => {
        let fullProof: FullProof

        before(async () => {
            fullProof = await api.generateHumanityProofByIdentity(
                groupId,
                api.identities[1],
                api.group,
                wasmFilePath,
                zkeyFilePath
            )
        })

        it("Should allow users to verify humanity anonymously", async () => {
            const transaction = verifyHumanity(zkPoHContract, fullProof)
            await expect(transaction).to.emit(zkPoHContract, "HumanProofVerified").withArgs(groupId)
        })

        it("Should allow users to verify humanity anonymously twice", async () => {
            const transaction = verifyHumanity(zkPoHContract, fullProof)

            await expect(transaction).to.emit(zkPoHContract, "HumanProofVerified").withArgs(groupId)
        })

        it("Should reject users not register as human", async () => {
            const userNotRegister = new Identity()
            api.group.addMember(userNotRegister.commitment)
            let proof = await api.generateHumanityProofByIdentity(
                groupId,
                userNotRegister,
                api.group,
                wasmFilePath,
                zkeyFilePath
            )

            const transaction = verifyHumanity(zkPoHContract, proof)
            await expect(transaction).to.be.rejected
            await expect(transaction).to.be.revertedWithCustomError(zkPoHContract, "ZKPoH__InvalidProofOfHumanity")
            const indexToRemove = api.group.indexOf(userNotRegister.commitment)
            //TODO: REVIEW removeMember does not remove the member for the array.
            api.group.removeMember(indexToRemove)
        })
    })

    describe("# accountsToRemove", () => {
        it("Should return empty if all humans accounts are still registered in PoH ", async () => {
            const accountsToRemove = await zkPoHContract.accountsToRemove()
            expect(accountsToRemove).to.be.empty
        })

        it("Should return an unregistered accounts if was unregistered form PoH ", async () => {
            const [owner, human1, human2] = await ethers.getSigners()
            expect(await pohContract.isRegistered(human1.address)).to.be.true
            expect(await pohContract.isRegistered(human2.address)).to.be.true
            await pohContract.unRegister(human1.address)
            await pohContract.unRegister(human2.address)
            const accountsToRemove = await zkPoHContract.accountsToRemove()
            expect(accountsToRemove).to.be.deep.equal([human1.address, human2.address])
        })
    })
})

/// HELPERS
function verifyHumanity(zkPoHContract: ZKProofOfHumanity, fullProof: FullProof) {
    return zkPoHContract.verifyHumanity(fullProof.merkleTreeRoot, fullProof.nullifierHash, fullProof.proof)
}
