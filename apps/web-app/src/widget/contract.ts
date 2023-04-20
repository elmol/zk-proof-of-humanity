
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
