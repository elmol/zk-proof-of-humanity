import { ethers } from "ethers"
import { task, types } from "hardhat/config"

const proposal = "Should the kingdom allow dragons to roam freely within its borders?<br/>" +
"Yes: Dragons are majestic creatures that could add to the magic and wonder of the kingdom. Allowing them to roam freely would make the kingdom more attractive to tourists and could bring in significant revenue. It would also create a unique and thrilling experience for those who seek adventure.<br/>" +
"No: Allowing dragons to roam freely poses a significant danger to the citizens and their livestock. Dragons are powerful creatures that can cause significant damage to the kingdom's infrastructure and property. The cost of maintaining and protecting the kingdom from dragon attacks would be too high, and the risk to the citizens would be too great."


task("deploy-mock", "Deploy zkpoh and poh mock contracts")
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers, run }) => {
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        const pohContract = await PoHFactory.deploy()
        const zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: "42" })

        const [, human] = await ethers.getSigners()
        await pohContract.addSubmissionManually(human.address)
        const ContractFactory = await ethers.getContractFactory("ZKVoting")
        const externalNullifier = randomNullifier()
        const contract = await ContractFactory.deploy( externalNullifier,proposal)

        if (logs) {
            console.info(`ZKProofOfHumanity contract has been deployed to: ${zkPoHContract.address}`)
            console.info(`Human Account PoH Registered: ${human.address}`)
            console.info(`Voting contract has been deployed to: ${contract.address} `)
            console.info(`Voting message id: `, externalNullifier)
        }
        return { address: zkPoHContract.address, account: human.address }
    })

function randomNullifier() {
    return ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
}
