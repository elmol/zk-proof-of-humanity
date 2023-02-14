<p align="center">
    <h1 align="center">
        ZK Proof of Humanity
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

ZK Proof of Humanity (zkPoH) allows humans, registered in Proof of Humanity, to prove their humanity without doxing.

The issue being addressed is that when a humans conducts transactions on or off-chain using an account registered in Proof of Humanity (PoH), their personal information (biometric data, voice, and video) is exposed (doxed).

ZK Proof of Humanity (zkPoH) uses Semaphore integrated with Proof of Humanity (PoH) to solve this issue.

The process starts by the user registering and being accepted as human in PoH protocol, then the user may register in zkPoH.
Before generating the off-chain identity using the Semaphore protocol, zkPoH checks if the user is registered in PoH, and adds it to the Semaphore PoH group.
This way the user can prove, through the proof generated off-chain using Semaphore, that they are human and unique, avoiding any risk of double-signaling, all this without revealing their original identity and sending signals such as votes or endorsements without the risk of doxing.

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

## Goerli Test Deployment

Goerli Proof of Humanity: `0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52`

```
$ yarn deploy --poh 0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52 --network goerli
Pairing library has been deployed to: 0x89722820625d6d87A38ac53c4FDc6E1A7cbF643b
SemaphoreVerifier contract has been deployed to: 0x8710b17B297592746B2DAb5D480b150DA5eB51A2
Poseidon library has been deployed to: 0x144104fdacB2BE94f802338252656a3673e56332
IncrementalBinaryTree library has been deployed to: 0x0bB29Ec74f5e3b2A7c13F8EABEb13fD7e8dB147A
Semaphore contract has been deployed to: 0x7C0C3758253885Bc00bCB386aF5e059250a9d1Ad
ZKProofOfHumanity contract has been deployed to: 0xbAcf2f5234C30CD10852c29a1C981F380e056e3f
Done in 99.28s.
```

Verification

```
$ yarn hardhat verify --network goerli 0xbAcf2f5234C30CD10852c29a1C981F380e056e3f 0x7C0C3758253885Bc00bCB386aF5e059250a9d1Ad 0x29988D3e5E716fdFf6a7Bfb34fe05B5A4F3C9b52 42
Successfully submitted source code for contract
contracts/ZKProofOfHumanity.sol:ZKProofOfHumanity at 0xbAcf2f5234C30CD10852c29a1C981F380e056e3f
for verification on the block explorer. Waiting for verification result...

Successfully verified contract ZKProofOfHumanity on Etherscan.
https://goerli.etherscan.io/address/0xbAcf2f5234C30CD10852c29a1C981F380e056e3f#code
Done in 10.51s.
```

# Localhost ZkPoH script tests

```
$ yarn hardhat node
```

Localhost deployment and human account registration in a PoH mock

```
$ yarn hardhat run scripts/mock-localhost-deployment.ts --network localhost
ZKProofOfHumanity contract has been deployed to: 0x0165878A594ca255338adfa4d48449f69242Eb8F
Human Account PoH Registered: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
Done in 12.21s.
```

ZKPoH account registration

```
$ yarn hardhat register --zkpoh 0x0165878A594ca255338adfa4d48449f69242Eb8F --network localhost
Human registration successfully DONE!
Account: [ 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 ]
Identity: [ ["3ff729abbf2207ea0af1f0aa2fa2cfff28f00341e3fb6230f5d6085459cc17","968b860bb3e241572f8565155613100965e21bd353410ecffb18cd96a4951"] ]
zkPoHAdress: [ 0x0165878A594ca255338adfa4d48449f69242Eb8F ]
```
