import { task, types } from "hardhat/config"

task("deploy", "Deploy a ZKProofOfHumanity contract")
    .addParam("poh", "ProofOfHumanity contract address", undefined, types.string)
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("group", "Group id (default env.GROUP_ID or random if is undefined)", undefined, types.string)
    .addOptionalParam("depth", "Merkle tree depth", 20, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(
        async ({ logs, semaphore: semaphoreAddress, poh: pohAddress, group: groupId, depth }, { ethers, run }) => {
            if (!semaphoreAddress) {
                const { semaphore } = await run("deploy:semaphore", {
                    logs
                })

                semaphoreAddress = semaphore.address
            }

            // get groupId from config file
            if (!groupId) {
                groupId = process.env.GROUP_ID
            }

            // random generate groupId
            if (!groupId) {
                groupId = ethers.BigNumber.from(ethers.utils.randomBytes(32)).toString()
            }

            const ZKProofOfHumanityFactory = await ethers.getContractFactory("ZKProofOfHumanity")
            const zkPoHContract = await ZKProofOfHumanityFactory.deploy(semaphoreAddress, pohAddress, groupId, depth)

            await zkPoHContract.deployed()

            if (logs) {
                console.info(`ZKProofOfHumanity contract has been deployed to: ${zkPoHContract.address}`)
                console.info(`ZKProofOfHumanity groupId: ${groupId}`)
                console.info(`ZKProofOfHumanity groupId: ${depth}`)
                const [owner] = await ethers.getSigners()
                console.info(`ZKProofOfHumanity deployed with account: ${owner.address}`)
            }

            return zkPoHContract
        }
    )
