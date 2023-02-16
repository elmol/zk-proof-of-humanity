import { task, types } from "hardhat/config"

task("deploy-mock", "Deploy zkpoh and poh mock contracts")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers, run }) => {
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        const pohContract = await PoHFactory.deploy()
        const zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: "42" })

        const [, human] = await ethers.getSigners()
        await pohContract.addSubmissionManually(human.address)

        if (logs) {
            console.info(`ZKProofOfHumanity contract has been deployed to: ${zkPoHContract.address}`)
            console.info(`Human Account PoH Registered: ${human.address}`)
        }
        return { address: zkPoHContract.address, account: human.address }
    })
