import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { run } from "hardhat"
import { ZKProofOfHumanity, Feedback } from "../build/typechain"
import { config } from "../package.json"
import { ethers } from "hardhat"

describe("Feedback", () => {
    let zkPoHContract: ZKProofOfHumanity
    let feedbackContract: Feedback

    const users: any = []
    const groupId = "42"
    const group = new Group(groupId)
    let owner

    before(async () => {
        // contracts deployment
        zkPoHContract = await run("deploy", { logs: false, group: groupId })

        const FeedbackFactory = await ethers.getContractFactory("Feedback")
        feedbackContract = await FeedbackFactory.deploy(zkPoHContract.address)

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

        const [owner, anon1, anon2] = await ethers.getSigners()
        const tx = zkPoHContract.register(group.members[0], anon1.address)
        const tx1 = zkPoHContract.register(group.members[1], anon2.address)
    })

    describe("# sendFeedback", () => {
        const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
        const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

        it("Should allow users to send feedback anonymously", async () => {
            const feedback = formatBytes32String("Hello World")

            const externalNullifier = await feedbackContract.externalNullifier()
            const fullProof = await generateProof(users[1].identity, group, externalNullifier, feedback, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = feedbackContract.sendFeedback(
                feedback,
                fullProof.publicSignals.merkleTreeRoot,
                fullProof.publicSignals.nullifierHash,
                solidityProof
            )

            await expect(transaction)
                .to.emit(feedbackContract, "NewFeedback")
                .withArgs(feedback)
        })

        it("Should not allow users to send feedback anonymously twice", async () => {
            const feedback = formatBytes32String("Hello World Twice")

            const externalNullifier = await feedbackContract.externalNullifier()
            const fullProof = await generateProof(users[1].identity, group, externalNullifier, feedback, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = feedbackContract.sendFeedback(
                feedback,
                fullProof.publicSignals.merkleTreeRoot,
                fullProof.publicSignals.nullifierHash,
                solidityProof
            )

            await expect(transaction).to.be.rejected
        })
    }),

    describe("# greet", () => {
        const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
        const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

        it("Should allow humans to greet anonymously", async () => {
            const greeting = formatBytes32String("Hello World")

            const signal = groupId
            const externalNullifier = groupId;

            const fullProof = await generateProof(users[1].identity, group, externalNullifier, signal, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = feedbackContract.greet(
                greeting,
                fullProof.publicSignals.merkleTreeRoot,
                fullProof.publicSignals.nullifierHash,
                solidityProof
            )

            await expect(transaction)
                .to.emit(feedbackContract, "NewGreeting")
                .withArgs(greeting)
        })

        it("Should allow humans to greet anonymously twice", async () => {
            const greeting = formatBytes32String("Hi again")

            const signal = groupId
            const externalNullifier = groupId;

            const fullProof = await generateProof(users[1].identity, group, externalNullifier, signal, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = feedbackContract.greet(
                greeting,
                fullProof.publicSignals.merkleTreeRoot,
                fullProof.publicSignals.nullifierHash,
                solidityProof
            )

            await expect(transaction)
                .to.emit(feedbackContract, "NewGreeting")
                .withArgs(greeting)
        })

    })
})
