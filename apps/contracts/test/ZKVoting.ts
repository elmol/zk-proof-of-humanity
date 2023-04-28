import { Group } from "@semaphore-protocol/group"
import { expect } from "chai"
import { ethers, run } from "hardhat"
import { ZKVoting, ProofOfHumanityMock, ZKProofOfHumanity } from "../build/typechain"

describe("ZKVoting", () => {
    let pohContract: ProofOfHumanityMock
    let zkPoHContract: ZKProofOfHumanity
    let contract: ZKVoting

    const users: any = []
    const groupId = "42"
    const externalNullifer = randomNullifier()
    const externalNullifer2 = randomNullifier();
    const group = new Group(groupId)

    before(async () => {
        // contracts deployment
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        pohContract = await PoHFactory.deploy()
        zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: groupId })

        const ContractFactory = await ethers.getContractFactory("ZKVoting")

        contract = await ContractFactory.deploy(externalNullifer)
    })

    describe("# construction", () => {
        it("Should be constructed with hardcoded message", async () => {
            expect("Voting system for president").equal(await contract.message())
        })

        it("Should be constructed with an message ID (externalNullifier)", async () => {
            expect(externalNullifer).equal(await contract.messageId())
        })

        it("Should be constructed with hardcoded message with mapping", async () => {
            expect("Voting system for president").equal(await contract.polls(externalNullifer))
        })
    })
 
    describe("# Add Polls", () => {
        it("Should allow adding a poll to the mapping", async () => {
            await contract.addToMapping(externalNullifer2,"addpoll");
            const cantidad = await contract.getAllKeys();
            expect(2).equal(cantidad.length)
        })

        it("You should search by key in the mapping", async () => {
             const _poll = await contract.polls(externalNullifer2);
             expect("addpoll").equal(_poll)
        })
    })
})

function randomNullifier() {
    return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
}
