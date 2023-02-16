import { formatBytes32String, hexStripZeros } from "ethers/lib/utils"
import { task, types } from "hardhat/config"
import { getIdentity, ZkPoHApi } from "../scripts/api/zk-poh-api"
import * as subgraphModule from "@semaphore-protocol/subgraph"
import { ImportMock } from "ts-mock-imports"
import { Group } from "@semaphore-protocol/group"
import { HardhatRuntimeEnvironment } from "hardhat/types"

task("verify-proof", "Verify proof of humanity and save nullifier to avoid double-signaling")
    .addOptionalParam("zkpoh", "ZKProofOfHumanity contract address", undefined, types.string)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, zkpoh: zkpohAddress }, { ethers, hre: HardhatRuntimeEnvironment }) => {
        if (!zkpohAddress) {
            zkpohAddress = process.env.ZK_POH_ADDRESS
        }

        const ZKProofOfHumanityFactory = await ethers.getContractFactory("ZKProofOfHumanity")
        const zkPoHContract = ZKProofOfHumanityFactory.attach(zkpohAddress)

        const [, human, anonymous] = await ethers.getSigners()

        const api = new ZkPoHApi("42")
        const identity = await getIdentity(human)
        const networkName = hre.network.name

        if (networkName === "localhost" || networkName === "hardhat") {
            const subgraphMock = ImportMock.mockClass(subgraphModule, "Subgraph")
            const groupToMock = new Group("42")
            groupToMock.addMember(identity.commitment)
            subgraphMock.mock("getGroup", groupToMock)
        }

        const signal = formatBytes32String("Hello World")
        const externalNullifier = api.groupId

        const fullProof = await api.generateZKPoHProof(identity, externalNullifier, signal)
        //use other account anonymous account
        const transaction = await zkPoHContract
            .connect(anonymous)
            .verifyProof(fullProof.merkleTreeRoot, signal, fullProof.nullifierHash, externalNullifier, fullProof.proof)
        await transaction.wait()

        if (logs) {
            console.info(`Human 👤 verification DONE! ✅ `)
            console.info(`zkPoHAdress: [ ${zkPoHContract.address} ]`)
            console.info(`Identity: [ ${identity.toString()} ]`)
            console.info(`ExternalNullifier: [ ${externalNullifier} ]`)
            console.info(`Signal: [ ${signal} ]`)
        }

        return transaction
    })
