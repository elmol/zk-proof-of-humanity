import { defineConfig } from '@wagmi/cli'
import { hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated/zk-poh-contract.ts',
  plugins: [
    hardhat({
      artifacts: 'build/contracts',
      project: '../contracts',
      include: ['ZKProofOfHumanity.json','PostLike.json'],
      deployments: {
        ZKProofOfHumanity: {
          5: '0x611F0278dE9D2Bd4E38F15001B6410B4A915275f',
          31337: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
          1337: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
        },
        PostLike: {
            5: '0x611F0278dE9D2Bd4E38F15001B6410B4A915275f',
            31337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
            1337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
        },
      }}),
    react({
      useContract: true,
      useContractEvent: false,
      useContractItemEvent: false,
      useContractRead: true,
      useContractFunctionRead: false,
      useContractWrite: false,
      usePrepareContractWrite: false,
      usePrepareContractFunctionWrite: true,
    }),
  ],
})
