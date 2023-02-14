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
        const group = await subgraph.getGroup(this.groupId)
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
