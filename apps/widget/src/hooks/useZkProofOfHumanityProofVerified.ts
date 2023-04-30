import { UseContractEventConfig, useContractEvent, useNetwork } from "wagmi";
import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "../generated/contract";

export function useZkProofOfHumanityProofVerified(
    config: Omit<
        UseContractEventConfig<typeof zkProofOfHumanityABI, "HumanProofVerified">,
        "abi" | "address" | "eventName"
    > & { chainId?: keyof typeof zkProofOfHumanityAddress,
        contractAddress?:`0x${string}` | undefined } = {} as any
) {
    const { chain } = useNetwork();
    const chainId = config.chainId ?? chain?.id;
    const address = config.contractAddress ?? zkProofOfHumanityAddress[
        chainId as keyof typeof zkProofOfHumanityAddress
    ]
    return useContractEvent({
        abi: zkProofOfHumanityABI,
        address: address,
        eventName: "HumanProofVerified",
        ...config,
    } as UseContractEventConfig<typeof zkProofOfHumanityABI, "HumanProofVerified">);
}
