const { ethers } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    // const stableAddress = (await ethers.getContract("StableCoinMock", deployer))
    //     .address
    await deploy("Lottery", {
        from: deployer,
        args: [],
        log: true,
    })
}

module.exports.tags = ["all", "lottery", "v2"]
