import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"
import { Network, Subgraph } from "@semaphore-protocol/subgraph"
import { config } from "../../package.json"

export class ZkPoHApi {
    public readonly wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
    public readonly zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

    constructor(public readonly groupId: string, public readonly network: Network = "goerli") {}
    async generateZKPoHProof(identity: Identity, externalNullifier: string, signal: string) {
        const subgraph = new Subgraph(this.network)
        const { members } = await subgraph.getGroup(this.groupId, { members: true })
        const group = new Group(this.groupId)
        members && group.addMembers(members)
        return await generateProof(identity, group, externalNullifier, signal, {
            wasmFilePath: this.wasmFilePath,
            zkeyFilePath: this.zkeyFilePath
        })
    }
}

export async function getIdentity(signer: any) {
    const signed = await signer.signMessage("zk-proof-of-humanity")
    return new Identity(signed)
}
