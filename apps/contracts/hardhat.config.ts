import "@nomiclabs/hardhat-ethers"
import "@nomicfoundation/hardhat-chai-matchers"
import "@semaphore-protocol/hardhat"
import "@typechain/hardhat"
import { config as dotenvConfig } from "dotenv"
import "hardhat-gas-reporter"
import { HardhatUserConfig } from "hardhat/config"
import { NetworksUserConfig } from "hardhat/types"
import { resolve } from "path"
import "solidity-coverage"
import { config } from "./package.json"

import "./tasks/deploy"
import "./tasks/deploy-mock"
import "./tasks/register"
import "./tasks/verify-proof"

import "solidity-docgen"
import "@nomicfoundation/hardhat-toolbox"

dotenvConfig({ path: resolve(__dirname, ".env") })

function getNetworks(): NetworksUserConfig {
    if (process.env.ETHEREUM_URL && process.env.ETHEREUM_PRIVATE_KEY) {
        const accounts = [`0x${process.env.ETHEREUM_PRIVATE_KEY}`, `0x${process.env.ETHEREUM_PRIVATE_KEY_2}`]

        return {
            goerli: {
                url: process.env.ETHEREUM_URL,
                chainId: 5,
                accounts
            },
            sepolia: {
                url: process.env.ETHEREUM_URL_SEPOLIA,
                chainId: 11155111,
                accounts
            }
        }
    }

    return {}
}

const hardhatConfig: HardhatUserConfig = {
    solidity: config.solidity,
    paths: {
        sources: config.paths.contracts,
        tests: config.paths.tests,
        cache: config.paths.cache,
        artifacts: config.paths.build.contracts
    },
    networks: {
        hardhat: {
            chainId: 1337
        },
        ...getNetworks()
    },
    gasReporter: {
        currency: "USD",
        enabled: process.env.REPORT_GAS === "true",
        coinmarketcap: process.env.COINMARKETCAP_API_KEY,
        outputFile: "./docs/zkpoh-gas-report.out",
        noColors: true
    },
    typechain: {
        outDir: config.paths.build.typechain,
        target: "ethers-v5"
    },
    docgen: {
        exclude: ["./Feedback.sol", "./IProofOfHumanity.sol", "./ProofOfHumanityMock.sol"],
        pages: "files"
    },
    etherscan: {
        apiKey: process.env.ETHERSCAN_API_KEY
    },
    mocha: {
        timeout: 100000000
    }
}

export default hardhatConfig
