import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
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
    let owner

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

    describe("# sendFeedback", () => {
        const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
        const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

        it("Should allow users to send feedback anonymously", async () => {
            const feedback = formatBytes32String("Hello World")

            const fullProof = await generateProof(users[1].identity, group, groupId, feedback, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = zkPoHContract.sendFeedback(
                feedback,
                fullProof.publicSignals.merkleTreeRoot,
                fullProof.publicSignals.nullifierHash,
                solidityProof
            )

            await expect(transaction)
                .to.emit(zkPoHContract, "NewFeedback")
                .withArgs(feedback)
        })
    })
})
