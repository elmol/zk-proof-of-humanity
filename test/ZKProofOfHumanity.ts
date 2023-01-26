import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { FullProof, generateProof, packToSolidityProof, SolidityProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { run } from "hardhat"
import { ZKProofOfHumanity } from "../build/typechain"
import { config } from "../package.json"
import { ethers } from "hardhat"

describe("ZKProofOfHumanity", () => {
    let zkPoHContract: ZKProofOfHumanity

    const users: any = []
    const groupId = "42"
    const group = new Group(groupId)

    const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
    const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

    before(async () => {
        // contracts deployment
        zkPoHContract = await run("deploy", { logs: false, group: groupId })

        // identity creation
        users.push({
            identity: new Identity(),
            username: formatBytes32String("anon1")
        })

        users.push({
            identity: new Identity(),
            username: formatBytes32String("anon2")
        })

        // local group adding
        group.addMember(users[0].identity.commitment)
        group.addMember(users[1].identity.commitment)
    })

    describe("# register", () => {
        it("Should allow accounts to register in zk-poh", async () => {
            const [owner, anon1, anon2] = await ethers.getSigners()

            const tx = zkPoHContract.register(group.members[0], anon1.address)
            await expect(tx)
                .to.emit(zkPoHContract, "NewUser")
                .withArgs(group.members[0], anon1.address)

            const tx1 = zkPoHContract.register(group.members[1], anon2.address)
            await expect(tx1)
                .to.emit(zkPoHContract, "NewUser")
                .withArgs(group.members[1], anon2.address)
        })

        it("Should not allow users to register in zk-poh twice", async () => {
            const [owner, anon1] = await ethers.getSigners()
            const transaction = zkPoHContract.register(group.members[0], anon1.address)
            await expect(transaction).to.be.revertedWithCustomError(zkPoHContract, "ZKPoH__AccountAlreadyExists")
        })
    })

    describe("# verifyProof", () => {
        let proof: { fullProof: FullProof; solidityProof: SolidityProof }
        const signal = formatBytes32String("Hello World")
        const externalNullifier = groupId

        before(async () => {
            proof = await generateSignalProof(users, group, externalNullifier, signal, wasmFilePath, zkeyFilePath)
        })

        it("Should allow users to signal anonymously", async () => {
            const transaction = zkPoHContract.verifyProof(
                proof.fullProof.publicSignals.merkleTreeRoot,
                signal,
                proof.fullProof.publicSignals.nullifierHash,
                externalNullifier,
                proof.solidityProof
            )

            await expect(transaction)
                .to.emit(zkPoHContract, "HumanProofVerified")
                .withArgs(signal)
        })

        it("Should not allow users to double-signal", async () => {
            const transaction = zkPoHContract.verifyProof(
                proof.fullProof.publicSignals.merkleTreeRoot,
                signal,
                proof.fullProof.publicSignals.nullifierHash,
                externalNullifier,
                proof.solidityProof
            )
            await expect(transaction).to.be.rejected
        })
    })

    describe("# verifyHumanity", () => {
        let proof: { fullProof: FullProof; solidityProof: SolidityProof }

        before(async () => {
            proof = await generateHumanityProof(groupId, users, group, wasmFilePath, zkeyFilePath)
        })

        it("Should allow users to verify humanity anonymously", async () => {
            const transaction = verifyHumanity(zkPoHContract, proof)
            await expect(transaction)
                .to.emit(zkPoHContract, "HumanProofVerified")
                .withArgs(groupId)
        })

        it("Should allow users to verify humanity anonymously twice", async () => {
            const transaction = verifyHumanity(zkPoHContract, proof)

            await expect(transaction)
                .to.emit(zkPoHContract, "HumanProofVerified")
                .withArgs(groupId)
        })

        it("Should reject users not register as human", async () => {
            const userNotRegister = new Identity();
            group.addMember(userNotRegister.commitment);
            let proof = await generateHumanityProofByIdentity(groupId,  userNotRegister, group, wasmFilePath, zkeyFilePath);

            const transaction = verifyHumanity(zkPoHContract, proof)
            await expect(transaction).to.be.rejected
            await expect(transaction).to.be.revertedWithCustomError(zkPoHContract, "ZKPoH__InvalidProofOfHumanity")
        });

    })
})


/// HELPERS
async function generateSignalProof(
    users: any,
    group: Group,
    externalNullifier: string,
    signal: string,
    wasmFilePath: string,
    zkeyFilePath: string
) {
    const fullProof = await generateProof(users[1].identity, group, externalNullifier, signal, {
        wasmFilePath,
        zkeyFilePath
    })
    const solidityProof = packToSolidityProof(fullProof.proof)
    return { fullProof, solidityProof }
}

async function generateHumanityProof(
    groupId: string,
    users: any,
    group: Group,
    wasmFilePath: string,
    zkeyFilePath: string
) {
    const identity = users[1].identity
    const { fullProof, solidityProof } = await generateHumanityProofByIdentity(groupId, identity, group, wasmFilePath, zkeyFilePath)
    return { fullProof, solidityProof }
}
async function generateHumanityProofByIdentity(groupId: string, identity: any, group: Group, wasmFilePath: string, zkeyFilePath: string) {
    const signal = groupId
    const externalNullifier = groupId
    const fullProof = await generateProof(identity, group, externalNullifier, signal, {
        wasmFilePath,
        zkeyFilePath
    })
    const solidityProof = packToSolidityProof(fullProof.proof)
    return { fullProof, solidityProof }
}

function verifyHumanity(zkPoHContract: ZKProofOfHumanity, proof: { fullProof: FullProof; solidityProof: SolidityProof }) {
    return zkPoHContract.verifyHumanity(
        proof.fullProof.publicSignals.merkleTreeRoot,
        proof.fullProof.publicSignals.nullifierHash,
        proof.solidityProof
    )
}

