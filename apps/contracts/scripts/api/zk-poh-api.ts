import { SemaphoreEthers, SemaphoreSubgraph } from "@semaphore-protocol/data"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"
import { config } from "../../package.json"

export class ZkPoHApi {
    public readonly wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
    public readonly zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

    constructor(
        public readonly groupId: string,
        public readonly depth: number = 20,
        public readonly network: string | "localhost" = "goerli",
        public readonly semaphoreAddress: string | undefined = undefined
    ) {}
    async generateZKPoHProof(identity: Identity, externalNullifier: string, signal: string) {
        const members = await this.getGroupMembers()
        const group = new Group(this.groupId, this.depth)
        members && group.addMembers(members)
        return await generateProof(identity, group, externalNullifier, signal, {
            wasmFilePath: this.wasmFilePath,
            zkeyFilePath: this.zkeyFilePath
        })
    }

    private async getGroupMembers() {
        if ("localhost" == this.network) {
            const semaphoreEthers = new SemaphoreEthers("http://localhost:8545", {
                address: this.semaphoreAddress
            })
            return await semaphoreEthers.getGroupMembers(this.groupId)
        }
        const subgraph = new SemaphoreSubgraph(this.network)
        const { members } = await subgraph.getGroup(this.groupId, { members: true })
        return members
    }
}

export async function getIdentity(signer: any) {
    const signed = await signer.signMessage("zk-proof-of-humanity")
    return new Identity(signed)
}
