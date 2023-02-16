import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { ethers, run } from "hardhat"
import { ZKProofOfHumanity } from "../build/typechain"
import { getIdentity } from "../scripts/api/zk-poh-api"

describe("ZKPoH Script", () => {
    let zkPoHContract: ZKProofOfHumanity

    before(async () => {
        const { address } = await run("deploy-mock", { logs: false })
        const ZKPoHFactory = await ethers.getContractFactory("ZKProofOfHumanity")
        zkPoHContract = ZKPoHFactory.attach(address)
    })

    describe("# register", () => {
        it("Should allow humans (registered accounts in poh) to register in zk-poh", async () => {
            const tx = await run("register", { zkpoh: zkPoHContract.address, logs: false })

            const [, human] = await ethers.getSigners()
            const identity = await getIdentity(human)
            await expect(tx).to.emit(zkPoHContract, "HumanRegistered").withArgs(identity.commitment, human.address)
        })
    })

    describe("# verifyProof", () => {
        it("Should allow users to signal anonymously", async () => {
            const tx = await run("verify-proof", { zkpoh: zkPoHContract.address, logs: false })

            const signal = formatBytes32String("Hello World")
            await expect(tx).to.emit(zkPoHContract, "HumanProofVerified").withArgs(signal)
        })
    })
})
