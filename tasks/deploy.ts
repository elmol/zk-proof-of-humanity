import { task, types } from "hardhat/config"

task("deploy", "Deploy a ZKProofOfHumanity contract")
    .addParam("poh", "ProofOfHumanity contract address", undefined, types.string)
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("group", "Group id", "42", types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(
        async ({ logs, semaphore: semaphoreAddress, poh: pohAddress, group: groupId }, { ethers, run }) => {
            if (!semaphoreAddress) {
                const { semaphore } = await run("deploy:semaphore", {
                    logs
                })

                semaphoreAddress = semaphore.address
            }42

            if (!groupId) {
                groupId = process.env.GROUP_ID
            }

            const ZKProofOfHumanityFactory = await ethers.getContractFactory("ZKProofOfHumanity")
            const zkPoHContract = await ZKProofOfHumanityFactory.deploy(semaphoreAddress, pohAddress, groupId)

            await zkPoHContract.deployed()

            if (logs) {
                console.info(`ZKProofOfHumanity contract has been deployed to: ${zkPoHContract.address}`)
            }

            return zkPoHContract
        }
    )
