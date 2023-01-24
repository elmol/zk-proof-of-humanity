import { task, types } from "hardhat/config"

task("deploy", "Deploy a ZKProofOfHumanity contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("group", "Group id", "42", types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { semaphore } = await run("deploy:semaphore", {
                logs
            })

            semaphoreAddress = semaphore.address
        }

        if (!groupId) {
            groupId = process.env.GROUP_ID
        }

        const ZKProofOfHumanityFactory = await ethers.getContractFactory("ZKProofOfHumanity")

        const zkPoHContract = await ZKProofOfHumanityFactory.deploy(semaphoreAddress, groupId)

        await zkPoHContract.deployed()

        if (logs) {
            console.info(`ZKProofOfHumanity contract has been deployed to: ${zkPoHContract.address}`)
        }

        return zkPoHContract
    })
