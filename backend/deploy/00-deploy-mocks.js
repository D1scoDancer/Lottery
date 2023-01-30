const { ethers, network } = require("hardhat")
const { developmentChains } = require("../helper-hardhat-config")

const BASE_FEE = ethers.utils.parseEther("0.25") // LINK
const GAS_PRICE_LINK = 1e9 // link per gas | it is random number for now CHANGE LATER!!!

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const args = [BASE_FEE, GAS_PRICE_LINK]

    if (developmentChains.includes(network.name)) {
        log("Local network detected! Deploying mocks..")
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: args,
        })
        await deploy("PoolAddressesProviderMock", {
            from: deployer,
            log: true,
            args: ["0", deployer],
        })
        await deploy("WETH9Mocked", {
            from: deployer,
            log: true,
            args: [],
        })
        log("Mocks Deployed!")
        log("-------------------------------------------")
    }
}

module.exports.tags = ["all", "mocks"]
