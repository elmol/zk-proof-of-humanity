import { defineConfig } from '@wagmi/cli'
import { hardhat, react } from '@wagmi/cli/plugins'

export default defineConfig({
  out: 'src/generated/contract.ts',
  plugins: [
    hardhat({
      artifacts: 'build/contracts',
      project: '../contracts',
      include: ['ZKProofOfHumanity.json'],
      deployments: {
        ZKProofOfHumanity: {
          5: '0x3575E04983C401f26fA02FC09f6EE97e44dF296B',
          31337: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
          1337: '0x0165878A594ca255338adfa4d48449f69242Eb8F',
        }
      }})
  ],
})
