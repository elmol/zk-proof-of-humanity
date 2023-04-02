import { zkProofOfHumanityABI, zkProofOfHumanityAddress } from "@/generated/zk-poh-contract"
import { UsePrepareContractWriteConfig, useNetwork, usePrepareContractWrite } from "wagmi"

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zkProofOfHumanityABI}__ and `functionName` set to `"register"`.
 */
export function usePrepareRegister(
    config: Omit<
      UsePrepareContractWriteConfig<typeof zkProofOfHumanityABI, 'register'>,
      'abi' | 'address' | 'functionName'
    > & { chainId?: keyof typeof zkProofOfHumanityAddress } = {} as any,
  ) {
    
    const { chain } = useNetwork()
    const chainId = config.chainId ?? chain?.id
    return usePrepareContractWrite({
      abi: zkProofOfHumanityABI,
      address:
        zkProofOfHumanityAddress[
          chainId as keyof typeof zkProofOfHumanityAddress
        ],
      functionName: 'register',
      chainId: chainId,
      ...config,
    } as UsePrepareContractWriteConfig<typeof zkProofOfHumanityABI, 'register'>)
  }
  