const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts() // swap for 0x87..?
    const chainId = network.config.chainId

    const vrfCoordinatorV2 = networkConfig[chainId]["vrfCoordinatorV2"]
    const fee = networkConfig[chainId]["fee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const link = networkConfig[chainId]["link"]

    const args = [fee, vrfCoordinatorV2, gasLane, callbackGasLimit, link]
    const lottery = await deploy("Lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })

    // call fund()
}

module.exports.tags = ["all", "lottery"]
