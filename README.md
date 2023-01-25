# ZK Proof of Humanity

## Project Overview

ZK Proof of Humanity (zkPoH) allows humans, registered in Proof of Humanity, to prove their humanity without doxing.

The issue being addressed is that when a humans conducts transactions on or off-chain using an account registered in Proof of Humanity (PoH), their personal information (biometric data, voice, and video) is exposed (doxed).

ZK Proof of Humanity (zkPoH) uses Semaphore integrated with Proof of Humanity (PoH) to solve this issue.


The process starts by the user registering and being accepted as human in PoH protocol, then the user may register in zkPoH. 
Before generating the off-chain identity using the Semaphore protocol, zkPoH checks if the user is registered in PoH, and adds it to the Semaphore PoH group. 
This way the user can prove, through the proof generated off-chain using Semaphore, that they are human and unique, avoiding any risk of double-signaling, all this without revealing their original identity and sending signals such as votes or endorsements without the risk of doxing.

## 🛠  Installation and Configuration

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

> **Note**  
> You should download the snark artifacts before run tests

```bash
yarn download:snark-artifacts
```

## 📜 Scripts

This project uses several scripts to help with the development and deployment of the contract.

- start: This script runs the project on a local network, This script starts the local node and then compiles the contract and deploys it on the local network.

- compile: This script compiles the contract using the command hardhat compile

- download:snark-artifacts: This script downloads SNARK artifacts

- deploy: This script deploys the contract to the network

- test: This script runs the tests


## Goerli Test Deployment

```
$ yarn deploy --network goerli
Pairing library has been deployed to: 0x0e269e16FFc1a77C3d90cCA5A4A2236D08707Ae7
SemaphoreVerifier contract has been deployed to: 0xB745aBEC9405058EB2EA46e91Fc0C611600d5C35
Poseidon library has been deployed to: 0x8956aCa1161A042fF56B74E72Fb7e29650d5429e
IncrementalBinaryTree library has been deployed to: 0x4b27F471297AFb6520fCd17b4FB051dED7Bd5dDB
Semaphore contract has been deployed to: 0xf44Ebff76F18500b399cCCbf8ae9125CD4d37DF0
ZKProofOfHumanity contract has been deployed to: 0x5AD776c3a9eF2fcd143D93cb2566249De4EdE21A
Done in 99.28s.
```