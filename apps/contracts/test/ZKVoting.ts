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
    const group = new Group(groupId)

    before(async () => {
        // contracts deployment
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        pohContract = await PoHFactory.deploy()
        zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: groupId })

        const ContractFactory = await ethers.getContractFactory("ZKVoting")

        contract = await ContractFactory.deploy(zkPoHContract.address, externalNullifer)
    })

    describe("# construction", () => {
        it("Should be constructed with hardcoded message", async () => {
            expect("The house is in order").equal(await contract.message())
        })

        it("Should be constructed with an message ID (externalNullifier)", async () => {
            expect(externalNullifer).equal(await contract.messageId())
        })
    })
})

function randomNullifier() {
    return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
}
