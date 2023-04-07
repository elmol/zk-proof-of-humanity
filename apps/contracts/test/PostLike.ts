import { Group } from "@semaphore-protocol/group"
import { expect } from "chai"
import { ethers, run } from "hardhat"
import { PostLike, ProofOfHumanityMock, ZKProofOfHumanity } from "../build/typechain"

describe("PostLike", () => {
    let pohContract: ProofOfHumanityMock
    let zkPoHContract: ZKProofOfHumanity
    let contract: PostLike

    const users: any = []
    const groupId = "42"
    const group = new Group(groupId)

    before(async () => {
        // contracts deployment
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        pohContract = await PoHFactory.deploy()
        zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: groupId })

        const ContractFactory = await ethers.getContractFactory("PostLike")
        contract = await ContractFactory.deploy(zkPoHContract.address)
    })

    describe("# construction", () => {
        it("Should be constructed with hardcoded message", async () => {
            expect("The house is in order").equal(await contract.message())
        })
    })
})
