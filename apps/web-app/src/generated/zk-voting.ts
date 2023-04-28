// Generated by @wagmi/cli@0.1.15 on 4/28/2023 at 6:53:36 PM
import {
  useNetwork,
  useContract,
  UseContractConfig,
  useContractRead,
  UseContractReadConfig,
  useContractWrite,
  Address,
  UseContractWriteConfig,
  usePrepareContractWrite,
  UsePrepareContractWriteConfig,
} from 'wagmi'
import {
  ReadContractResult,
  WriteContractMode,
  PrepareWriteContractResult,
} from 'wagmi/actions'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZKVoting
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const zkVotingABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: '_pollId', internalType: 'uint256', type: 'uint256' },
      { name: '_proposal', internalType: 'string', type: 'string' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_pollId', internalType: 'uint256', type: 'uint256' },
      { name: '_proposal', internalType: 'string', type: 'string' },
    ],
    name: 'addToMapping',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getAllKeys',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'keys',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'polls',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const zkVotingAddress = {
  5: '0x611F0278dE9D2Bd4E38F15001B6410B4A915275f',
  1337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  31337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const zkVotingConfig = {
  address: zkVotingAddress,
  abi: zkVotingABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContract}__ with `abi` set to __{@link zkVotingABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkVoting(
  config: Omit<UseContractConfig, 'abi' | 'address'> & {
    chainId?: keyof typeof zkVotingAddress
  } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContract({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link zkVotingABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkVotingRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof zkVotingABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof zkVotingABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof zkVotingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractRead({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    ...config,
  } as UseContractReadConfig<typeof zkVotingABI, TFunctionName, TSelectData>)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zkVotingABI}__ and `functionName` set to `"addToMapping"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkVotingAddToMapping<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof zkVotingAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof zkVotingABI, 'addToMapping'>['abi'],
        'addToMapping'
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'addToMapping'
      }
    : UseContractWriteConfig<TMode, typeof zkVotingABI, 'addToMapping'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addToMapping'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractWrite<TMode, typeof zkVotingABI, 'addToMapping'>({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    functionName: 'addToMapping',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zkVotingABI}__ and `functionName` set to `"addToMapping"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function usePrepareZkVotingAddToMapping(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zkVotingABI, 'addToMapping'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zkVotingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return usePrepareContractWrite({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    functionName: 'addToMapping',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zkVotingABI, 'addToMapping'>)
}
