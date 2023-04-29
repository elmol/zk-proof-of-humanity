import { useNetwork,useContract, UseContractConfig } from "wagmi"
import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "../generated/contract"

export function useZkProofOfHumanity(
    config: Omit<UseContractConfig, 'abi' | 'address'> & {
      chainId?: keyof typeof zkProofOfHumanityAddress,
      contractAddress?:`0x${string}` | undefined } = {} as any,
  ) {
    const { chain } = useNetwork()
    const chainId = config.chainId ?? chain?.id
    const address = config.contractAddress ?? zkProofOfHumanityAddress[
        chainId as keyof typeof zkProofOfHumanityAddress
    ]
    return useContract({
      abi: zkProofOfHumanityABI,
      address: address,
      ...config,
    })
  }
