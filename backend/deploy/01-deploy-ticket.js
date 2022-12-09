const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    const stableAddress = (await ethers.getContract("StableCoinMock", deployer))
        .address
    await deploy("Ticket", {
        from: deployer,
        args: [100, stableAddress],
        log: true,
    })
}

module.exports.tags = ["all", "ticket"]
