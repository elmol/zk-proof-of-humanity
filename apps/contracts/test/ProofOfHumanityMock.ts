import { ethers } from "hardhat"
import { expect } from "chai"
import { ProofOfHumanityMock } from "../build/typechain"

describe("ProofOfHumanityMock", () => {
    describe("# isRegistered", () => {
        let pohContract: ProofOfHumanityMock
        beforeEach(async () => {
            const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
            pohContract = await PoHFactory.deploy()
        })
        it("Should return false if account is not registered", async () => {
            const [owner, human1] = await ethers.getSigners()
            expect(await pohContract.isRegistered(human1.address)).to.be.false
        })

        it("Should return true if account is registered", async () => {
            const [owner, human1] = await ethers.getSigners()
            await pohContract.addSubmissionManually(human1.address)
            expect(await pohContract.isRegistered(human1.address)).to.be.true
        })

        it("Should unregister a registered account ", async () => {
            const [owner, human1] = await ethers.getSigners()
            await pohContract.addSubmissionManually(human1.address)
            expect(await pohContract.isRegistered(human1.address)).to.be.true
            await pohContract.unRegister(human1.address)
            expect(await pohContract.isRegistered(human1.address)).to.be.false
        })
    })
})
