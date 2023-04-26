<p align="center">
    <h1 align="center">
         🎭 ZK Proof of Humanity
    </h1>
</p>

<p align="center">
    <a href="https://github.com/elmol/zk-proof-of-humanity" target="_blank">
        <img src="https://img.shields.io/badge/project-ZK%20ProofOfHumanity-blue.svg?style=flat-square">
    </a>
    <a href="/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/elmol/zk-proof-of-humanity.svg?style=flat-square">
    </a>
    <a href="https://github.com/elmol/zk-proof-of-humanity/actions?query=workflow%3Aproduction">
        <img alt="GitHub Workflow test" src="https://img.shields.io/github/actions/workflow/status/elmol/zk-proof-of-humanity/production.yaml?branch=main&label=test&style=flat-square&logo=github">
    </a>
    <a href="https://coveralls.io/github/elmol/zk-proof-of-humanity">
        <img alt="Coveralls" src="https://img.shields.io/coveralls/github/elmol/zk-proof-of-humanity?style=flat-square&logo=coveralls">
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>
    <img alt="Repository top language" src="https://img.shields.io/github/languages/top/elmol/zk-proof-of-humanity?style=flat-square">

</p>


<p align="center">
  <table align="center">
    <tr>
      <td><a href="https://www.npmjs.com/package/zkpoh-widget"><strong>📦 zkpoh-widget</strong></a></td>
      <td>
      <a href="https://www.npmjs.com/package/zkpoh-widget"><img src="https://img.shields.io/npm/v/zkpoh-widget.svg?style=flat-square" alt="npm version" /></a></td>
    </tr>
  </table>
</p>

## Project Overview

<p style="text-align:center;">
<b>ZK Proof of Humanity</b> allows humans, registered in <b>Proof of Humanity</b>, to prove their humanity without doxing.
</p>

The issue being addressed is that when a humans conducts transactions on or off-chain using an account registered in [Proof of Humanity](https://blog.kleros.io/proof-of-humanity-a-building-block-for-the-internet-of-the-future/), their personal information (biometric data, voice, and video) is exposed (doxed).

ZK Proof of Humanity (zkPoH) uses [Semaphore](https://semaphore.appliedzkp.org/) integrated with Proof of Humanity (PoH) to solve this issue.

It consists of a smart contract that allows subscribing as a member to a Semaphore group only if the subscriber is registered in PoH. In this way, any member of this group can emit signals (votes, approvals, etc.) without revealing their identity and ensuring that they are registered in PoH as a human.

![process](https://user-images.githubusercontent.com/5402004/222273896-9421c0c3-5007-4e9f-a877-b7b921ebca4a.png)

When a human subscribes to zkPoH, they must send the [identity commitment](https://https://semaphore.appliedzkp.org/docs/glossary#identity-commitment) with the account that is registered in Proof of Humanity. The protocol only allows subscribing to valid accounts in PoH that are not already registered in zkPoH. Once the human is registered in zkPoH, they can generate proofs and emit signals, [like the Semaphore protocol](https://semaphore.appliedzkp.org/docs/guides/proofs#verify-a-proof-on-chain), without exposing their identity. To generate the identity, [the deterministic method](https://semaphore.appliedzkp.org/docs/guides/identities#create-deterministic-identities) is used which signs a message with the account registered in Proof of Humanity

## 🚀 Repository
Clone the repository:

```bash
git clone https://github.com/elmol/zk-proof-of-humanity.git
```

## 🛠 Installation
Install the dependencies:

```bash
yarn
```

## 📜 General Scripts

-   `yarn dev` starts the dapp locally: run local network, deploy contracts and start the webapp.
-   `yarn dev:web-app` starts the web application for your Dapp locally.
-   `yarn dev:contracts`  runs the project on a local network, This script starts the local node and then compiles the contract and deploys it on the local network.
-   `yarn prettier` runs prettier.
-   `yarn prettier:write` fixes any formatting issues in the code.

# 📑 Table of Contents

- [💼 Smart Contracts](#---smart-contracts)
  * [🛠 Configuration](#---configuration)
  * [📜 Scripts](#---scripts)
  * [👨‍💻 Tasks](#------tasks)
    + [Registration Task](#registration-task)
    + [Verification Task](#verification-task)
  * [📦 Goerli Deployment](#---goerli-deployment)
    + [Proof of Humanity](#proof-of-humanity)
    + [Deployment](#deployment)
    + [Verification](#verification)
    + [Tasks usage example in Goerli](#tasks-usage-example-in-goerli)
  * [💰 Cost Analysis](#---cost-analysis)
  * [📖 Contract Documentation](#---contract-documentation)
- [🖥️ Web Application](#----web-application)
    + [Demo](#demo)
  * [🛠 Contract address configuration](#---contract-address-configuration)
  * [📜 Usage](#---usage)
    + [Start the app](#start-the-app)
    + [Dev mode](#dev-mode)

# 💼 Smart Contracts
Select contract directory `apps/contracts`

```bash
cd apps/contracts
```

## 🛠 Configuration

Copy the .env.example file as .env and add your environment variables:

```bash
cp .env.example .env
```

> **Note**  
> You should at least set a valid Ethereum URL (e.g. Infura) and a private key with some ethers.

Deploy the contract:

```bash
yarn deploy --semaphore <semaphore-address> --group <group-id> --network goerli
```

Verify the contract

```bash
yarn verify <zk-proof-of-humanity-address> <semaphore-address> <proof-of-humanity-address> <group-id> --network goerli
```

> **Note**  
> You should download the snark artifacts before run tests

```bash
yarn download:snark-artifacts
```

## 📜 Scripts

This project uses several scripts to help with the development and deployment of the contract.

-   dev: This script runs the project on a local network, This script starts the local node and then compiles the contract and deploys it on the local network.

-   compile: This script compiles the contract using the command hardhat compile

-   download:snark-artifacts: This script downloads SNARK artifacts

-   deploy: This script deploys the contract to the network

-   verify: verify the contract

-   test: This script runs the tests

-   test:report-gas: Runs automated tests for a smart contract project with gas usage reporting enabled.

-   test:coverage: Generates a code coverage report for a smart contract project.

-   docgen: Generates documentation for the contract

-   prettier: Runs prettier

## 👨‍💻 Tasks

The following hardhat tasks were developed to help testing the protocol in goerli network.

> It uses hardhat configured accounts

### Registration Task

Register a human account in ZKProofOfHumanity

```
$ yarn hardhat register --help
Usage: hardhat [GLOBAL OPTIONS] register [--human <STRING>] [--logs <BOOLEAN>] [--zkpoh <STRING>]

OPTIONS:

  --human       Human account (default accounts[1])
  --logs        Print the logs (default: true)
  --zkpoh       ZKProofOfHumanity contract address (default env ZK_POH_ADDRESS)

register: Register a human account in ZKProofOfHumanity
```

**Localhost example**

```
$ yarn hardhat node
```

Localhost deployment and human account registration in a PoH mock

```
$ yarn hardhat deploy-mock --network localhost
yarn run v1.22.19
ZKProofOfHumanity contract has been deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Human Account PoH Registered: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Done in 4.42s.
```

ZKPoH account registration

```
$ yarn hardhat register --zkpoh 0x0165878A594ca255338adfa4d48449f69242Eb8F --network localhost
👤 Human registration successfully DONE! ✅
> zkPoHAdress: [ 0x0165878A594ca255338adfa4d48449f69242Eb8F ]
> Account: [ 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 ]
> 🔒 Identity: [ ["3ff729abbf2207ea0af1f0aa2fa2cfff28f00341e3fb6230f5d6085459cc17","968b860bb3e241572f8565155613100965e21bd353410ecffb18cd96a4951"] ]
Done in 3.42s.
```

### Verification Task

Verify proof of humanity and save nullifier to avoid double-signaling

```
Usage: hardhat [GLOBAL OPTIONS] verify-proof [--anon <STRING>] [--externalnullifier <STRING>] [--human <STRING>] [--logs <BOOLEAN>] [--signal <STRING>] [--zkpoh <STRING>]

OPTIONS:

  --anon                Anonymous account to verify the proof on-chain (default accounts[2])
  --externalnullifier   ExternalNullifier - (default groupId)
  --human               Human account to get the identity (default accounts[1])
  --logs                Print the logs (default: true)
  --signal              Signal to broadcast (default: "Hello World")
  --zkpoh               ZKProofOfHumanity contract address (default env ZK_POH_ADDRESS)

verify-proof: Verify proof of humanity and save nullifier to avoid double-signaling
```

**Localhost example**

```
$ yarn run hardhat verify-proof --zkpoh "0x0165878A594ca255338adfa4d48449f69242Eb8F" --signal "Hi ZKPoH" --network localhost

👤 Human verification DONE! ✅
> zkPoHAdress: [ 0x0165878A594ca255338adfa4d48449f69242Eb8F ]
> 🔒 Identity: [ ["3ff729abbf2207ea0af1f0aa2fa2cfff28f00341e3fb6230f5d6085459cc17","968b860bb3e241572f8565155613100965e21bd353410ecffb18cd96a4951"] ]
> ExternalNullifier: [ 42 ]
> Signal: [ Hi ZKPoH ]
Done in 14.48s
```

## 📦 Goerli Deployment

### Proof of Humanity

Goerli Proof of Humanity Contract: `0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52`
Goerli Proof of Humanity test webapp: https://proof-of-humanity-web-elmol.vercel.app/ 

### Deployment

```
$ yarn deploy --poh 0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52 --semaphore 0x89490c95eD199D980Cdb4FF8Bac9977EDb41A7E7 --network goerli
ZKProofOfHumanity contract has been deployed to: 0x611F0278dE9D2Bd4E38F15001B6410B4A915275f
ZKProofOfHumanity groupId: 10751501845980352646290421047126323754464353897673667581659089592139261440434
ZKProofOfHumanity depth: 20
ZKProofOfHumanity deployed with account: 0xaDa5168fA388d4bB6F6A1bd762a9B9a3d3033e0C
Done in 17.88s.
```

### Verification

```
yarn hardhat verify --network goerli <zkpoh-address> <semaphore-address> <poh-address> <groupId>
```

```
$ yarn hardhat verify --network goerli 0x611F0278dE9D2Bd4E38F15001B6410B4A915275f 0x89490c95eD199D980Cdb4FF8Bac9977EDb41A7E7 0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52 10751501845980352646290421047126323754464353897673667581659089592139261440434 20
Successfully submitted source code for contract
contracts/ZKProofOfHumanity.sol:ZKProofOfHumanity at 0x611F0278dE9D2Bd4E38F15001B6410B4A915275f
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ZKProofOfHumanity on Etherscan.
https://goerli.etherscan.io/address/0x611F0278dE9D2Bd4E38F15001B6410B4A915275f#code
Done in 139.57s.
```

### Tasks usage example in Goerli

**Registration**

Registration of the human https://proof-of-humanity-web-elmol.vercel.app/profile/0x45756fed107d0aea575a2dc0d49a1c5156b0b796

```
$ yarn run hardhat register --zkpoh "0x611F0278dE9D2Bd4E38F15001B6410B4A915275f" --human "0x45756fED107d0aEA575a2dc0d49a1c5156b0b796" --network goerli

👤 Human registration successfully DONE! ✅
> zkPoHAdress: [ 0x611F0278dE9D2Bd4E38F15001B6410B4A915275f ]
> Account: [ 0x45756fED107d0aEA575a2dc0d49a1c5156b0b796 ]
> 🔒 Identity: [ <<secret>> ]
Done in 16.09s.

```

https://goerli.etherscan.io/tx/0x41a22af5c4a5c44fc6b6487f45d9d33fb2133427484fe8b205cba71963ac8e46

**Verification and signal broadcasting**

```
$ yarn run hardhat verify-proof --zkpoh "0x611F0278dE9D2Bd4E38F15001B6410B4A915275f" --signal "Hi ZKPoH" --externalnullifier "1" --human "0x45756fED107d0aEA575a2dc0d49a1c5156b0b796" ----anon "0xaDa5168fA388d4bB6F6A1bd762a9B9a3d3033e0C" --network goerli

👤 Human verification DONE! ✅
> zkPoHAdress: [ 0x611F0278dE9D2Bd4E38F15001B6410B4A915275f ]
> 🔒 Identity: [ <<secret>> ]
> ExternalNullifier: [ 1 ]
> Signal: [ Hi ZKPoH ]
Done in 53.85s.
```

https://goerli.etherscan.io/tx/0xc83700c09a7654bb0fe9c215aafc8d1be694d125622e0b36809c95612ad9525a

## 💰 Cost Analysis

-   [Semaphore Gas Report](docs/semaphore-gas-report.out?raw=100)
-   [zkPoH Gas Report](docs/zkpoh-gas-report.out?raw=100)

```
·-------------------------------------------------|---------------------------|-----------------|-----------------------------·
|               Solc version: 0.8.4               ·  Optimizer enabled: true  ·  Runs: 1000000  ·  Block limit: 30000000 gas  │
························|·························|·············|·············|·················|···············|··············
|  Contract             ·  Method                 ·  Min        ·  Max        ·  Avg            ·  # calls      ·  usd (avg)  │
························|·························|·············|·············|·················|···············|··············
|  Methods                                        ·                 33 gwei/gas                 ·       1651.85 usd/eth       │
························|·························|·············|·············|·················|···············|··············
|  ZKProofOfHumanity    ·  register               ·     974390  ·    1751356  ·        1523169  ·           17  ·      83.03  │
························|·························|·············|·············|·················|···············|··············
|  ZKProofOfHumanity    ·  verifyProof            ·     350468  ·     350504  ·         350487  ·           10  ·      19.11  │
·-------------------------------------------------|-------------|-------------|-----------------|---------------|-------------·
```

## 📖 Contract Documentation

[ZK Proof of Humanity Documentation](docs/ZKProofOfHumanity.md)


# 🖥️ Web Application

This is the web app that serves as the frontend user interface for ZK Proof of Humanity.

The main objective of this dapp is to provide a user-friendly experience for both registered and non-registered ZK Proof of Humanity users to easily and securely verify their humanity, while maintaining anonymity.

It's a [Next.js](https://nextjs.org/) based project and features a customizable ``<Button\>`` react component that guides users through the entire process, from registration to human verification.  This process can be visualized in the accompanying flow graph.

> Note: The human verification is conducted using a random `externalNullifier` and the signal `I'm human` 

![button-flow](https://user-images.githubusercontent.com/5402004/229957133-efb42ead-af58-438a-b287-96b9a32472ee.png)

Goerli versel deployment: https://zk-proof-of-humanity.vercel.app/ 

### Demo

https://user-images.githubusercontent.com/5402004/229678557-2f133fa6-a9af-4ab0-b449-946c8ab5d8ae.mp4

## 🛠 Contract address configuration

Select contract directory `apps/web-app`

```bash
cd apps/web-app
```

- In `wagmi.config.ts` update the contract addresses for each supported network.
- Run `yarn generate` to update the configuration.

## 📜 Usage

### Start the app

```bash
yarn start
```

### Dev mode

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

# 🧰 ZK Proof of Humanity Widget

React library that enables easy integration with ZK Proof of Humanity for your projects.

More information in [widget readme](apps/widget/README.md)

You can find the npm package in <a href="https://www.npmjs.com/package/zkpoh-widget" style="color: #333; text-decoration: none;"><strong>📦 zkpoh-widget</strong></a>
