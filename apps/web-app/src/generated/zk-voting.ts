// Generated by @wagmi/cli@0.1.15 on 5/7/2023 at 8:24:13 PM
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x925a401C30309F8586ee68de29d615D80C188bE4)
 */
export const zkVotingABI = [
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: '_pollId', internalType: 'uint256', type: 'uint256' },
      { name: '_proposal', internalType: 'string', type: 'string' },
    ],
    name: 'addPoll',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'getPollIds',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'pollIds',
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x925a401C30309F8586ee68de29d615D80C188bE4)
 */
export const zkVotingAddress = {
  5: '0x611F0278dE9D2Bd4E38F15001B6410B4A915275f',
  1337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  31337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  11155111: '0x925a401C30309F8586ee68de29d615D80C188bE4',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x925a401C30309F8586ee68de29d615D80C188bE4)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x925a401C30309F8586ee68de29d615D80C188bE4)
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
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x925a401C30309F8586ee68de29d615D80C188bE4)
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
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zkVotingABI}__ and `functionName` set to `"addPoll"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x925a401C30309F8586ee68de29d615D80C188bE4)
 */
export function useZkVotingAddPoll<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof zkVotingAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<typeof zkVotingABI, 'addPoll'>['abi'],
        'addPoll'
      > & { address?: Address; chainId?: TChainId; functionName?: 'addPoll' }
    : UseContractWriteConfig<TMode, typeof zkVotingABI, 'addPoll'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'addPoll'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractWrite<TMode, typeof zkVotingABI, 'addPoll'>({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    functionName: 'addPoll',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zkVotingABI}__ and `functionName` set to `"addPoll"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 * - [__View Contract on Sepolia Etherscan__](https://sepolia.etherscan.io/address/0x925a401C30309F8586ee68de29d615D80C188bE4)
 */
export function usePrepareZkVotingAddPoll(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zkVotingABI, 'addPoll'>,
    'abi' | 'address' | 'functionName'
  > & { chainId?: keyof typeof zkVotingAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return usePrepareContractWrite({
    abi: zkVotingABI,
    address: zkVotingAddress[chainId as keyof typeof zkVotingAddress],
    functionName: 'addPoll',
    ...config,
  } as UsePrepareContractWriteConfig<typeof zkVotingABI, 'addPoll'>)
}
