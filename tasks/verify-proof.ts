import { formatBytes32String, hexStripZeros } from "ethers/lib/utils"
import { task, types } from "hardhat/config"
import { getIdentity, ZkPoHApi } from "../scripts/api/zk-poh-api"
import * as subgraphModule from "@semaphore-protocol/data"
import { ImportMock } from "ts-mock-imports"
import { Group } from "@semaphore-protocol/group"
import { HardhatRuntimeEnvironment } from "hardhat/types"
import { Identity } from "@semaphore-protocol/identity"

task("verify-proof", "Verify proof of humanity and save nullifier to avoid double-signaling")
    .addOptionalParam(
        "zkpoh",
        "ZKProofOfHumanity contract address (default env ZK_POH_ADDRESS)",
        undefined,
        types.string
    )
    .addOptionalParam("signal", "Signal to broadcast", "Hello World", types.string)
    .addOptionalParam("externalnullifier", "ExternalNullifier - (default groupId)", undefined, types.string)
    .addOptionalParam("human", "Human account to get the identity (default accounts[1])", undefined, types.string)
    .addOptionalParam(
        "anon",
        "Anonymous account to verify the proof on-chain (default accounts[2])",
        undefined,
        types.string
    )
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, zkpoh: zkpohAddress, signal, externalnullifier, human, anon }, { ethers, network }) => {
        // get contract
        if (!zkpohAddress) {
            zkpohAddress = process.env.ZK_POH_ADDRESS
        }
        const ZKProofOfHumanityFactory = await ethers.getContractFactory("ZKProofOfHumanity")
        const zkPoHContract = ZKProofOfHumanityFactory.attach(zkpohAddress)

        let humanSigner
        if (!human) {
            ;[, humanSigner] = await ethers.getSigners()
        } else {
            humanSigner = await ethers.getSigner(human)
        }

        let anonSigner
        if (!anon) {
            ;[, , anonSigner] = await ethers.getSigners()
        } else {
            anonSigner = await ethers.getSigner(anon)
        }

        const identity = await getIdentity(humanSigner)

        // mock subgraph if needed
        const networkName = network.name
        if (networkName === "localhost" || networkName === "hardhat") {
            mockSubgraph(identity)
        }

        const groupId = await zkPoHContract.groupId()
        const api = new ZkPoHApi(groupId.toString())

        const externalNullifier = externalnullifier ? externalnullifier : api.groupId
        const signalFormatted = formatBytes32String(signal)

        const fullProof = await api.generateZKPoHProof(identity, externalNullifier, signalFormatted)

        const transaction = await zkPoHContract
            .connect(anonSigner)
            .verifyProof(
                fullProof.merkleTreeRoot,
                signalFormatted,
                fullProof.nullifierHash,
                externalNullifier,
                fullProof.proof
            )

        await transaction.wait()

        if (logs) {
            console.info(`👤 Human verification DONE! ✅ `)
            console.info(`> zkPoHAdress: [ ${zkPoHContract.address} ]`)
            console.info(`> 🔒 Identity: [ ${identity.toString()} ]`)
            console.info(`> ExternalNullifier: [ ${externalNullifier} ]`)
            console.info(`> Signal: [ ${signal} ]`)
        }

        return transaction
    })
function mockSubgraph(identity: Identity) {
    const subgraphMock = ImportMock.mockClass(subgraphModule, "SemaphoreSubgraph")
    const groupToMock = new Group("42")
    groupToMock.addMember(identity.commitment)
    subgraphMock.mock("getGroup", groupToMock)
}
