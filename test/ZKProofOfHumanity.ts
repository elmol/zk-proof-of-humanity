import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { FullProof, generateProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { run } from "hardhat"
import { ProofOfHumanityMock, ZKProofOfHumanity } from "../build/typechain"
import { config } from "../package.json"
import { ethers } from "hardhat"

describe("ZKProofOfHumanity", () => {
    let zkPoHContract: ZKProofOfHumanity
    let pohContract: ProofOfHumanityMock

    const identities: Identity[] = []
    const groupId = "42"
    const group = new Group(groupId)

    const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
    const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

    before(async () => {
        // contracts deployment
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        pohContract = await PoHFactory.deploy()
        zkPoHContract = await run("deploy", { proofOfHumanity: pohContract.address, logs: false, group: groupId })

        // identity creation
        identities.push(new Identity())
        identities.push(new Identity())

        // local group adding
        group.addMember(identities[0].commitment)
        group.addMember(identities[1].commitment)
    })

    describe("# register", () => {
        it("Should allow humans (registered accounts in poh) to register in zk-poh", async () => {
            const [owner, human1, human2] = await ethers.getSigners()

            await pohContract.addSubmissionManually(human1.address)
            const tx = zkPoHContract.connect(human1).register(group.members[0])
            await expect(tx).to.emit(zkPoHContract, "NewUser").withArgs(group.members[0], human1.address)

            await pohContract.addSubmissionManually(human2.address)
            const tx1 = zkPoHContract.connect(human2).register(group.members[1])
            await expect(tx1).to.emit(zkPoHContract, "NewUser").withArgs(group.members[1], human2.address)
        })

        it("Should not allow same identity to register in zk-poh twice", async () => {
            const [owner, human1, human2, human3] = await ethers.getSigners()
            await pohContract.addSubmissionManually(human3.address)
            const identityCommitment = group.members[0]
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
            fullProof = await generateProof(identities[1], group, externalNullifier, signal, {
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
            fullProof = await generateHumanityProofByIdentity(groupId, identities[1], group, wasmFilePath, zkeyFilePath)
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
            group.addMember(userNotRegister.commitment)
            let proof = await generateHumanityProofByIdentity(
                groupId,
                userNotRegister,
                group,
                wasmFilePath,
                zkeyFilePath
            )

            const transaction = verifyHumanity(zkPoHContract, proof)
            await expect(transaction).to.be.rejected
            await expect(transaction).to.be.revertedWithCustomError(zkPoHContract, "ZKPoH__InvalidProofOfHumanity")
        })
    })
})

/// HELPERS
async function generateHumanityProofByIdentity(
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

function verifyHumanity(zkPoHContract: ZKProofOfHumanity, fullProof: FullProof) {
    return zkPoHContract.verifyHumanity(fullProof.merkleTreeRoot, fullProof.nullifierHash, fullProof.proof)
}
