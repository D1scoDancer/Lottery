const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const depositAssetAddress = networkConfig[chainId]["depositAssetAddress"]
    const poolAddressProvider = networkConfig[chainId]["poolAddressProvider"]

    const args = [depositAssetAddress, poolAddressProvider]
    await deploy("AaveDeposit", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "deposit"]
