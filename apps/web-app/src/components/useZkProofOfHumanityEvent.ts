import { UseContractEventConfig, useContractEvent, useNetwork } from "wagmi";
import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "./contract";

export function useZkProofOfHumanityProofVerified(
    config: Omit<
        UseContractEventConfig<typeof zkProofOfHumanityABI, "HumanProofVerified">,
        "abi" | "address" | "eventName"
    > & { chainId?: keyof typeof zkProofOfHumanityAddress } = {} as any
) {
    const { chain } = useNetwork();
    const chainId = config.chainId ?? chain?.id;
    return useContractEvent({
        abi: zkProofOfHumanityABI,
        address: zkProofOfHumanityAddress[chainId as keyof typeof zkProofOfHumanityAddress],
        eventName: "HumanProofVerified",
        ...config,
    } as UseContractEventConfig<typeof zkProofOfHumanityABI, "HumanProofVerified">);
}
