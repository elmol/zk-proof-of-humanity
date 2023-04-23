import { useNetwork,useContract, UseContractConfig } from "wagmi"
import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "../generated/contract"

/**
 * Wraps __{@link useContract}__ with `abi` set to __{@link zkProofOfHumanityABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkProofOfHumanity(
    config: Omit<UseContractConfig, 'abi' | 'address'> & {
      chainId?: keyof typeof zkProofOfHumanityAddress
    } = {} as any,
  ) {
    const { chain } = useNetwork()
    const chainId = config.chainId ?? chain?.id
    return useContract({
      abi: zkProofOfHumanityABI,
      address:
        zkProofOfHumanityAddress[
          chainId as keyof typeof zkProofOfHumanityAddress
        ],
      ...config,
    })
  }
