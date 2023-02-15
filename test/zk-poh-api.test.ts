import { Group } from "@semaphore-protocol/group"
import * as subgraphModule from "@semaphore-protocol/subgraph"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { ethers, run } from "hardhat"
import { ImportMock } from "ts-mock-imports"
import { ProofOfHumanityMock, ZKProofOfHumanity } from "../build/typechain"
import { getIdentity, ZkPoHApi } from "../scripts/api/zk-poh-api"

describe("ZKPoHAPI", () => {
    let zkPoHContract: ZKProofOfHumanity
    let pohContract: ProofOfHumanityMock

    const api = new ZkPoHApi("42")
    const subgraphMock = ImportMock.mockClass(subgraphModule, "Subgraph")

    before(async () => {
        // contracts deployment
        const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
        pohContract = await PoHFactory.deploy()
        zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: api.groupId })

        //mock subgraph
        const [, human] = await ethers.getSigners()
        const identity = await getIdentity(human)
        const groupToMock = new Group("42")
        groupToMock.addMember(identity.commitment)
        subgraphMock.mock("getGroup", { members: groupToMock.members.map((m) => m.toString()) })
    })

    describe("# register", () => {
        it("Should allow humans (registered accounts in poh) to register in zk-poh", async () => {
            const [, human] = await ethers.getSigners()
            await pohContract.addSubmissionManually(human.address)

            const identity = await getIdentity(human)
            const tx = register(zkPoHContract, human, identity.commitment)

            await expect(tx).to.emit(zkPoHContract, "HumanRegistered").withArgs(identity.commitment, human.address)
        })
    })

    describe("# verifyProof", () => {
        it("Should allow users to signal anonymously", async () => {
            const [, human] = await ethers.getSigners()

            const signal = formatBytes32String("Hello World")
            const externalNullifier = api.groupId
            const identity = await getIdentity(human)

            const fullProof = await api.generateZKPoHProof(identity, externalNullifier, signal)
            const transaction = verifyProof(zkPoHContract, fullProof, signal, externalNullifier)

            await expect(transaction).to.emit(zkPoHContract, "HumanProofVerified").withArgs(signal)
        })
    })

    describe("# verifyHumanity", () => {
        it("Should allow users to verify humanity anonymously", async () => {
            const [, human] = await ethers.getSigners()

            const signal = formatBytes32String("Hello World")
            const externalNullifier = api.groupId
            const identity = await getIdentity(human)

            const fullProof = await api.generateZKPoHProof(identity, externalNullifier, signal)
            const transaction = zkPoHContract.verifyHumanity(
                fullProof.merkleTreeRoot,
                signal,
                fullProof.nullifierHash,
                externalNullifier,
                fullProof.proof
            )

            await expect(transaction).to.emit(zkPoHContract, "HumanProofVerified").withArgs(signal)
        })
    })
})

function verifyProof(contract: ZKProofOfHumanity, fullProof: any, signal: string, externalNullifier: string) {
    return contract.verifyProof(
        fullProof.merkleTreeRoot,
        signal,
        fullProof.nullifierHash,
        externalNullifier,
        fullProof.proof
    )
}

function register(contract: ZKProofOfHumanity, human: any, commitment: bigint) {
    return contract.connect(human).register(commitment)
}
