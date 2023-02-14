import { ethers, run } from "hardhat"

async function main() {
    const PoHFactory = await ethers.getContractFactory("ProofOfHumanityMock")
    const pohContract = await PoHFactory.deploy()
    const zkPoHContract = await run("deploy", { poh: pohContract.address, logs: false, group: "42" })

    const [, human] = await ethers.getSigners()
    await pohContract.addSubmissionManually(human.address)

    console.info(`ZKProofOfHumanity contract has been deployed to: ${zkPoHContract.address}`)
    console.info(`Human Account PoH Registered: ${human.address}`)
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
