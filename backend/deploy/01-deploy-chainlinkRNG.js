const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()

    let vrfCoordinatorV2Address, gasLane, subscriptionId, callbackGasLimit
    if (developmentChains.includes(network.name)) {
    } else {
    }

    const args = [vrfCoordinatorV2Address, gasLane, subscriptionId, callbackGasLimit]
    const chainlinkRNG = await deploy("ChainlinkRNG", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "chainlinkRNG"]
