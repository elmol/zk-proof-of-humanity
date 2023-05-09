import { defineConfig } from '@wagmi/cli'
import { hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated/zk-voting.ts',
  plugins: [
    hardhat({
      artifacts: 'build/contracts',
      project: '../contracts',
      include: ['ZKVoting.json'],
      deployments: {
        ZKVoting: {
            5: '0xbfdF33c66A1b334fD06d6655e8c389c416c2fd3a',
            31337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
            1337: '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6',
            11155111:'0x925a401C30309F8586ee68de29d615D80C188bE4'
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
