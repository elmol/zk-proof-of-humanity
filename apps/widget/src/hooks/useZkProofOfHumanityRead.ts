import { UseContractReadConfig, useNetwork,useContractRead } from "wagmi"
import { ReadContractResult } from "wagmi/actions"
import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "../generated/contract"

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zkProofOfHumanityABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
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
  > & { chainId?: keyof typeof zkProofOfHumanityAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractRead({
    abi: zkProofOfHumanityABI,
    address:
      zkProofOfHumanityAddress[
        chainId as keyof typeof zkProofOfHumanityAddress
      ],
    ...config,
  } as UseContractReadConfig<
    typeof zkProofOfHumanityABI,
    TFunctionName,
    TSelectData
  >)
}
