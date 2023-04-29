import { UseContractReadConfig, useNetwork,useContractRead } from "wagmi"
import { ReadContractResult } from "wagmi/actions"
import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "../generated/contract"

export function useZkProofOfHumanityRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof zkProofOfHumanityABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<
      typeof zkProofOfHumanityABI,
      TFunctionName,
      TSelectData
    >,
    'abi' | 'address'
  > & { chainId?: keyof typeof zkProofOfHumanityAddress,
    contractAddress?:`0x${string}` | undefined } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  const address = config.contractAddress ?? zkProofOfHumanityAddress[
    chainId as keyof typeof zkProofOfHumanityAddress
]
  return useContractRead({
    abi: zkProofOfHumanityABI,
    address: address,
    ...config,
  } as UseContractReadConfig<
    typeof zkProofOfHumanityABI,
    TFunctionName,
    TSelectData
  >)
}
