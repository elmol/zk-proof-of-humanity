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

## Project Overview

<p style="text-align:center;">
<b>ZK Proof of Humanity</b> allows humans, registered in <b>Proof of Humanity</b>, to prove their humanity without doxing.
</p>

The issue being addressed is that when a humans conducts transactions on or off-chain using an account registered in [Proof of Humanity](https://blog.kleros.io/proof-of-humanity-a-building-block-for-the-internet-of-the-future/), their personal information (biometric data, voice, and video) is exposed (doxed).

ZK Proof of Humanity (zkPoH) uses [Semaphore](https://semaphore.appliedzkp.org/) integrated with Proof of Humanity (PoH) to solve this issue.

It consists of a smart contract that allows subscribing as a member to a Semaphore group only if the subscriber is registered in PoH. In this way, any member of this group can emit signals (votes, approvals, etc.) without revealing their identity and ensuring that they are registered in PoH as a human.

![process](https://user-images.githubusercontent.com/5402004/222273896-9421c0c3-5007-4e9f-a877-b7b921ebca4a.png)

When a human subscribes to zkPoH, they must send the [identity commitment](https://https://semaphore.appliedzkp.org/docs/glossary#identity-commitment) with the account that is registered in Proof of Humanity. The protocol only allows subscribing to valid accounts in PoH that are not already registered in zkPoH. Once the human is registered in zkPoH, they can generate proofs and emit signals, [like the Semaphore protocol](https://semaphore.appliedzkp.org/docs/guides/proofs#verify-a-proof-on-chain), without exposing their identity. To generate the identity, [the deterministic method](https://semaphore.appliedzkp.org/docs/guides/identities#create-deterministic-identities) is used which signs a message with the account registered in Proof of Humanity

## 🛠 Installation and Configuration

Clone the repository:

```bash
git clone https://github.com/elmol/zk-proof-of-humanity.git
```

Install the dependencies:

```bash
yarn
```

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

-   start: This script runs the project on a local network, This script starts the local node and then compiles the contract and deploys it on the local network.

-   compile: This script compiles the contract using the command hardhat compile

-   download:snark-artifacts: This script downloads SNARK artifacts

-   deploy: This script deploys the contract to the network

-   verify: verify the contract

-   test: This script runs the tests

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

Goerli Proof of Humanity: `0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52`

### Deployment

```
$ yarn deploy --poh 0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52 --semaphore 0x89490c95eD199D980Cdb4FF8Bac9977EDb41A7E7 --network goerli
ZKProofOfHumanity contract has been deployed to: 0x3813D200087aB055850E0CFF31Be161280E6a88c
ZKProofOfHumanity groupId: 7523080083455154518145106003120918809044440191248508385464348112321586185494
ZKProofOfHumanity deployed with account: 0xaDa5168fA388d4bB6F6A1bd762a9B9a3d3033e0C
Done in 74.07s.
```

### Verification

```
yarn hardhat verify --network goerli <zkpoh-address> <semaphore-address> <poh-address> <groupId>
```

```
$ yarn hardhat verify --network goerli 0x3813D200087aB055850E0CFF31Be161280E6a88c 0x89490c95eD199D980Cdb4FF8Bac9977EDb41A7E7 0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52 7523080083455154518145106003120918809044440191248508385464348112321586185494
Successfully submitted source code for contract
contracts/ZKProofOfHumanity.sol:ZKProofOfHumanity at 0x3813D200087aB055850E0CFF31Be161280E6a88c
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ZKProofOfHumanity on Etherscan.
https://goerli.etherscan.io/address/0x3813D200087aB055850E0CFF31Be161280E6a88c#code
Done in 11.33s
```

### Tasks usage example in Goerli

**Registration**

Registration of the human https://proof-of-humanity-web-elmol.vercel.app/profile/0x45756fed107d0aea575a2dc0d49a1c5156b0b796

```
 $ yarn run hardhat register --zkpoh "0x3813D200087aB055850E0CFF31Be161280E6a88c" --human "0x45756fED107d0aEA575a2dc0d49a1c5156b0b796" --network goerli

 👤 Human registration successfully DONE! ✅
> zkPoHAdress: [ 0x3813D200087aB055850E0CFF31Be161280E6a88c ]
> Account: [ 0x45756fED107d0aEA575a2dc0d49a1c5156b0b796 ]
> 🔒 Identity: [<<secret>>]
Done in 31.91s.

```

https://goerli.etherscan.io/tx/0xad97956b9ddce43cc80584a81b8c398e41c9fc29927323dfbfc5fd66be2c6494

**Verification and signal broadcasting**

```
$ yarn run hardhat verify-proof --zkpoh "0x3813D200087aB055850E0CFF31Be161280E6a88c" --signal "Hi ZKPoH" --externalnullifier "1" --human "0x45756fED107d0aEA575a2dc0d49a1c5156b0b796" ----anon "0xaDa5168fA388d4bB6F6A1bd762a9B9a3d3033e0C"  --network goerli

👤 Human verification DONE! ✅
> zkPoHAdress: [ 0x3813D200087aB055850E0CFF31Be161280E6a88c ]
> 🔒 Identity: [ <<secret>> ]
> ExternalNullifier: [ 1 ]
> Signal: [ Hi ZKPoH ]
Done in 32.51s.
```

https://goerli.etherscan.io/tx/0x379579d2c332c15ea1341fc2115269cb1e839401f6fd9cec46ad12c148d45b66

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
