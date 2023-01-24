import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { run } from "hardhat"
import { ZKProofOfHumanity } from "../build/typechain"
import { config } from "../package.json"

describe("ZKProofOfHumanity", () => {
    let zkPoHContract: ZKProofOfHumanity

    const users: any = []
    const groupId = "42"
    const group = new Group(groupId)

    before(async () => {
        zkPoHContract = await run("deploy", { logs: false, group: groupId })

        users.push({
            identity: new Identity(),
            username: formatBytes32String("anon1")
        })

        users.push({
            identity: new Identity(),
            username: formatBytes32String("anon2")
        })

        group.addMember(users[0].identity.commitment)
        group.addMember(users[1].identity.commitment)
    })

    describe("# joinGroup", () => {
        it("Should allow users to join the group", async () => {
            for (let i = 0; i < group.members.length; i += 1) {
                const transaction = zkPoHContract.joinGroup(group.members[i], users[i].username)

                await expect(transaction)
                    .to.emit(zkPoHContract, "NewUser")
                    .withArgs(group.members[i], users[i].username)
            }
        })

        it("Should not allow users to join the group with the same username", async () => {
            const transaction = zkPoHContract.joinGroup(group.members[0], users[0].username)

            await expect(transaction).to.be.revertedWithCustomError(zkPoHContract, "Feedback__UsernameAlreadyExists")
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

            await expect(transaction).to.emit(zkPoHContract, "NewFeedback").withArgs(feedback)
        })
    })
})
