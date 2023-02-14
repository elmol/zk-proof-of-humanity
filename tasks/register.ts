import { hexStripZeros } from "ethers/lib/utils"
import { task, types } from "hardhat/config"
import { getIdentity } from "../scripts/api/zk-poh-api"

task("register", "Register a human account in ZKProofOfHumanity")
    .addOptionalParam("zkpoh", "ZKProofOfHumanity contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, zkpoh: zkpohAddress }, { ethers, run }) => {
        if (!zkpohAddress) {
            zkpohAddress = process.env.ZK_POH_ADDRESS
        }

        const ZKProofOfHumanityFactory = await ethers.getContractFactory("ZKProofOfHumanity")
        const zkPoHContract = ZKProofOfHumanityFactory.attach(zkpohAddress)

        const [, human] = await ethers.getSigners()
        const identity = await getIdentity(human)

        const transaction = await zkPoHContract.connect(human).register(identity.commitment)
        await transaction.wait()

        if (logs) {
            console.info(`Human registration successfully DONE!`)
            console.info(`Account: [ ${human.address} ]`)
            console.info(`Identity: [ ${identity.toString()} ]`)
            console.info(`zkPoHAdress: [ ${zkPoHContract.address} ]`)
        }

        return zkPoHContract
    })
