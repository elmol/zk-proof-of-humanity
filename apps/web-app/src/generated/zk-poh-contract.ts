// Generated by @wagmi/cli@0.1.14 on 4/7/2023 at 7:51:21 PM
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
// PostLike
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const postLikeABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'zkPoHAddress', internalType: 'address', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'message',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'zKProofOfHumanity',
    outputs: [
      { name: '', internalType: 'contract ZKProofOfHumanity', type: 'address' },
    ],
  },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const postLikeAddress = {
  5: '0x611F0278dE9D2Bd4E38F15001B6410B4A915275f',
  1337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
  31337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const postLikeConfig = {
  address: postLikeAddress,
  abi: postLikeABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ZKProofOfHumanity
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const zkProofOfHumanityABI = [
  {
    stateMutability: 'nonpayable',
    type: 'constructor',
    inputs: [
      { name: 'semaphoreAddress', internalType: 'address', type: 'address' },
      { name: 'pohAddress', internalType: 'address', type: 'address' },
      { name: '_groupId', internalType: 'uint256', type: 'uint256' },
      { name: '_depth', internalType: 'uint256', type: 'uint256' },
    ],
  },
  { type: 'error', inputs: [], name: 'ZKPoH__AccountAlreadyExists' },
  { type: 'error', inputs: [], name: 'ZKPoH__AccountAlreadyMatch' },
  { type: 'error', inputs: [], name: 'ZKPoH__AccountNotRegisteredInPoH' },
  { type: 'error', inputs: [], name: 'ZKPoH__InvalidProofOfHumanity' },
  { type: 'error', inputs: [], name: 'ZKPoH__NotRegisteredAccount' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'signal',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'HumanProofVerified',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'identityCommitment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'HumanRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'identityCommitment',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'account',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'HumanRemoved',
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'depth',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'groupId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isIdentity',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'isRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'proofSiblings', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'proofPathIndices', internalType: 'uint8[]', type: 'uint8[]' },
    ],
    name: 'matchAccount',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'mismatchedAccounts',
    outputs: [{ name: '', internalType: 'address[]', type: 'address[]' }],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'poh',
    outputs: [
      { name: '', internalType: 'contract IProofOfHumanity', type: 'address' },
    ],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'identityCommitment', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'register',
    outputs: [],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [],
    name: 'semaphore',
    outputs: [
      { name: '', internalType: 'contract ISemaphore', type: 'address' },
    ],
  },
  {
    stateMutability: 'view',
    type: 'function',
    inputs: [
      { name: 'merkleTreeRoot', internalType: 'uint256', type: 'uint256' },
      { name: 'signal', internalType: 'uint256', type: 'uint256' },
      { name: 'nullifierHash', internalType: 'uint256', type: 'uint256' },
      { name: 'externalNullifier', internalType: 'uint256', type: 'uint256' },
      { name: 'proof', internalType: 'uint256[8]', type: 'uint256[8]' },
    ],
    name: 'verifyHumanity',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
  },
  {
    stateMutability: 'nonpayable',
    type: 'function',
    inputs: [
      { name: 'merkleTreeRoot', internalType: 'uint256', type: 'uint256' },
      { name: 'signal', internalType: 'uint256', type: 'uint256' },
      { name: 'nullifierHash', internalType: 'uint256', type: 'uint256' },
      { name: 'externalNullifier', internalType: 'uint256', type: 'uint256' },
      { name: 'proof', internalType: 'uint256[8]', type: 'uint256[8]' },
    ],
    name: 'verifyProof',
    outputs: [],
  },
] as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const zkProofOfHumanityAddress = {
  5: '0x611F0278dE9D2Bd4E38F15001B6410B4A915275f',
  1337: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
  31337: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
} as const

/**
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export const zkProofOfHumanityConfig = {
  address: zkProofOfHumanityAddress,
  abi: zkProofOfHumanityABI,
} as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useContract}__ with `abi` set to __{@link postLikeABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function usePostLike(
  config: Omit<UseContractConfig, 'abi' | 'address'> & {
    chainId?: keyof typeof postLikeAddress
  } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContract({
    abi: postLikeABI,
    address: postLikeAddress[chainId as keyof typeof postLikeAddress],
    ...config,
  })
}

/**
 * Wraps __{@link useContractRead}__ with `abi` set to __{@link postLikeABI}__.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function usePostLikeRead<
  TFunctionName extends string,
  TSelectData = ReadContractResult<typeof postLikeABI, TFunctionName>,
>(
  config: Omit<
    UseContractReadConfig<typeof postLikeABI, TFunctionName, TSelectData>,
    'abi' | 'address'
  > & { chainId?: keyof typeof postLikeAddress } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractRead({
    abi: postLikeABI,
    address: postLikeAddress[chainId as keyof typeof postLikeAddress],
    ...config,
  } as UseContractReadConfig<typeof postLikeABI, TFunctionName, TSelectData>)
}

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

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zkProofOfHumanityABI}__ and `functionName` set to `"matchAccount"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkProofOfHumanityMatchAccount<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof zkProofOfHumanityAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<
          typeof zkProofOfHumanityABI,
          'matchAccount'
        >['abi'],
        'matchAccount'
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'matchAccount'
      }
    : UseContractWriteConfig<
        TMode,
        typeof zkProofOfHumanityABI,
        'matchAccount'
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'matchAccount'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractWrite<TMode, typeof zkProofOfHumanityABI, 'matchAccount'>({
    abi: zkProofOfHumanityABI,
    address:
      zkProofOfHumanityAddress[
        chainId as keyof typeof zkProofOfHumanityAddress
      ],
    functionName: 'matchAccount',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zkProofOfHumanityABI}__ and `functionName` set to `"register"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkProofOfHumanityRegister<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof zkProofOfHumanityAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<
          typeof zkProofOfHumanityABI,
          'register'
        >['abi'],
        'register'
      > & { address?: Address; chainId?: TChainId; functionName?: 'register' }
    : UseContractWriteConfig<TMode, typeof zkProofOfHumanityABI, 'register'> & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'register'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractWrite<TMode, typeof zkProofOfHumanityABI, 'register'>({
    abi: zkProofOfHumanityABI,
    address:
      zkProofOfHumanityAddress[
        chainId as keyof typeof zkProofOfHumanityAddress
      ],
    functionName: 'register',
    ...config,
  } as any)
}

/**
 * Wraps __{@link useContractWrite}__ with `abi` set to __{@link zkProofOfHumanityABI}__ and `functionName` set to `"verifyProof"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function useZkProofOfHumanityVerifyProof<
  TMode extends WriteContractMode,
  TChainId extends number = keyof typeof zkProofOfHumanityAddress,
>(
  config: TMode extends 'prepared'
    ? UseContractWriteConfig<
        TMode,
        PrepareWriteContractResult<
          typeof zkProofOfHumanityABI,
          'verifyProof'
        >['abi'],
        'verifyProof'
      > & {
        address?: Address
        chainId?: TChainId
        functionName?: 'verifyProof'
      }
    : UseContractWriteConfig<
        TMode,
        typeof zkProofOfHumanityABI,
        'verifyProof'
      > & {
        abi?: never
        address?: never
        chainId?: TChainId
        functionName?: 'verifyProof'
      } = {} as any,
) {
  const { chain } = useNetwork()
  const chainId = config.chainId ?? chain?.id
  return useContractWrite<TMode, typeof zkProofOfHumanityABI, 'verifyProof'>({
    abi: zkProofOfHumanityABI,
    address:
      zkProofOfHumanityAddress[
        chainId as keyof typeof zkProofOfHumanityAddress
      ],
    functionName: 'verifyProof',
    ...config,
  } as any)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zkProofOfHumanityABI}__ and `functionName` set to `"matchAccount"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function usePrepareZkProofOfHumanityMatchAccount(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zkProofOfHumanityABI, 'matchAccount'>,
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
    functionName: 'matchAccount',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zkProofOfHumanityABI,
    'matchAccount'
  >)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zkProofOfHumanityABI}__ and `functionName` set to `"register"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function usePrepareZkProofOfHumanityRegister(
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
    ...config,
  } as UsePrepareContractWriteConfig<typeof zkProofOfHumanityABI, 'register'>)
}

/**
 * Wraps __{@link usePrepareContractWrite}__ with `abi` set to __{@link zkProofOfHumanityABI}__ and `functionName` set to `"verifyProof"`.
 *
 * - [__View Contract on Goerli Etherscan__](https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f)
 * -
 * -
 */
export function usePrepareZkProofOfHumanityVerifyProof(
  config: Omit<
    UsePrepareContractWriteConfig<typeof zkProofOfHumanityABI, 'verifyProof'>,
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
    functionName: 'verifyProof',
    ...config,
  } as UsePrepareContractWriteConfig<
    typeof zkProofOfHumanityABI,
    'verifyProof'
  >)
}
