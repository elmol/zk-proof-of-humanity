import { ethers } from "ethers"
import { task, types } from "hardhat/config"

task("deploy-mock", "Deploy zkpoh and poh mock contracts")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers, run }) => {
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        const pohContract = await PoHFactory.deploy()
        const zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: "42" })

        const [, human] = await ethers.getSigners()
        await pohContract.addSubmissionManually(human.address)
        const ContractFactory = await ethers.getContractFactory("PostLike")
        const externalNullifier = randomNullifier()
        const contract = await ContractFactory.deploy(zkPoHContract.address, externalNullifier)

        if (logs) {
            console.info(`ZKProofOfHumanity contract has been deployed to: ${zkPoHContract.address}`)
            console.info(`Human Account PoH Registered: ${human.address}`)
            console.info(`Post Like contract has been deployed to: ${contract.address} `)
            console.info(`Post Like message id: `, externalNullifier)
        }
        return { address: zkPoHContract.address, account: human.address }
    })

function randomNullifier() {
    return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
}
