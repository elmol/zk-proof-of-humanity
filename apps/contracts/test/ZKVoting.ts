import { expect } from "chai"
import { ethers } from "hardhat"
import { ProofOfHumanityMock, ZKProofOfHumanity, ZKVoting } from "../build/typechain"

describe("ZKVoting", () => {
    let contract: ZKVoting

    const pollId1 = randomNullifier()
    const pollId2 = randomNullifier();
    const proposal = "Should the kingdom allow dragons to roam freely within its borders?<br/>" +
    "Yes: Dragons are majestic creatures that could add to the magic and wonder of the kingdom. Allowing them to roam freely would make the kingdom more attractive to tourists and could bring in significant revenue. It would also create a unique and thrilling experience for those who seek adventure.<br/>" +
    "No: Allowing dragons to roam freely poses a significant danger to the citizens and their livestock. Dragons are powerful creatures that can cause significant damage to the kingdom's infrastructure and property. The cost of maintaining and protecting the kingdom from dragon attacks would be too high, and the risk to the citizens would be too great."


    before(async () => {
        const ContractFactory = await ethers.getContractFactory("ZKVoting")
        contract = await ContractFactory.deploy();
    })

    describe("# Add Polls", () => {

        it("Should allow adding a poll", async () => {
            await contract.addPoll(pollId1,proposal);
            const amount = await contract.getPollIds();
            expect(1).equal(amount.length);
            const pollId = await contract.pollIds(0)
            expect(pollId1).equal(pollId);
            expect(proposal).equal(await contract.polls(pollId));
        })

        it("Should allow adding an other poll", async () => {
            await contract.addPoll(pollId2,"proposal text 2");
            const amount = await contract.getPollIds();
            expect(2).equal(amount.length)
        })

        it("You should search by pollId", async () => {
             const proposal = await contract.polls(pollId2);
             expect("proposal text 2").equal(proposal)
        })
    })
})

function randomNullifier() {
    return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
}
