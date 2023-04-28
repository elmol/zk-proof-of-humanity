import { Group } from "@semaphore-protocol/group"
import { expect } from "chai"
import { ethers, run } from "hardhat"
import { ZKVoting, ProofOfHumanityMock, ZKProofOfHumanity } from "../build/typechain"

describe("ZKVoting", () => {
    let pohContract: ProofOfHumanityMock
    let zkPoHContract: ZKProofOfHumanity
    let contract: ZKVoting

    const groupId = "42"
    const pollId1 = randomNullifier()
    const pollId2 = randomNullifier();
    const proposal = "Should the kingdom allow dragons to roam freely within its borders?<br/>" +
    "Yes: Dragons are majestic creatures that could add to the magic and wonder of the kingdom. Allowing them to roam freely would make the kingdom more attractive to tourists and could bring in significant revenue. It would also create a unique and thrilling experience for those who seek adventure.<br/>" +
    "No: Allowing dragons to roam freely poses a significant danger to the citizens and their livestock. Dragons are powerful creatures that can cause significant damage to the kingdom's infrastructure and property. The cost of maintaining and protecting the kingdom from dragon attacks would be too high, and the risk to the citizens would be too great."


    before(async () => {
        // contracts deployment
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        pohContract = await PoHFactory.deploy()
        zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: groupId })

        const ContractFactory = await ethers.getContractFactory("ZKVoting")

        contract = await ContractFactory.deploy(pollId1,proposal)
    })

    describe("# construction", () => {

        it("Should be constructed with an init proposal", async () => {
            expect(proposal).equal(await contract.polls(pollId1))
        })

        it("Should be constructed with an init poll ID (externalNullifier)", async () => {
            const pollIds = await contract.getAllKeys()
            expect(pollId1).equal(pollIds[0])
        })
    })

    describe("# Add Polls", () => {
        it("Should allow adding a poll to the mapping", async () => {
            await contract.addToMapping(pollId2,"addpoll");
            const amount = await contract.getAllKeys();
            expect(2).equal(amount.length)
        })

        it("You should search by key in the mapping", async () => {
             const _poll = await contract.polls(pollId2);
             expect("addpoll").equal(_poll)
        })
    })
})

function randomNullifier() {
    return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
}
