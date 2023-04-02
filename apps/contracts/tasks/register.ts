import { hexStripZeros } from "ethers/lib/utils"
import { task, types } from "hardhat/config"
import { getIdentity } from "../scripts/api/zk-poh-api"

task("register", "Register a human account in ZKProofOfHumanity")
    .addOptionalParam(
        "zkpoh",
        "ZKProofOfHumanity contract address (default env ZK_POH_ADDRESS)",
        undefined,
        types.string
    )
    .addOptionalParam("human", "Human account (default accounts[1])", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, zkpoh: zkpohAddress, human: humanAddress }, { ethers, run }) => {
        // get contract
        if (!zkpohAddress) {
            zkpohAddress = process.env.ZK_POH_ADDRESS
        }
        const ZKProofOfHumanityFactory = await ethers.getContractFactory("ZKProofOfHumanity")
        const zkPoHContract = ZKProofOfHumanityFactory.attach(zkpohAddress)

        //get human signer
        let human
        if (!humanAddress) {
            ;[, human] = await ethers.getSigners()
        } else {
            human = await ethers.getSigner(humanAddress)
        }

        const identity = await getIdentity(human)

        const transaction = await zkPoHContract.connect(human).register(identity.commitment)
        await transaction.wait()

        if (logs) {
            console.info(`👤 Human registration successfully DONE! ✅ `)
            console.info(`> zkPoHAdress: [ ${zkPoHContract.address} ]`)
            console.info(`> Account: [ ${human.address} ]`)
            console.info(`> 🔒 Identity: [ ${identity.toString()} ]`)
        }

        return transaction
    })
