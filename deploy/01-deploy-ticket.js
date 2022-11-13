const { network } = require("hardhat")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy } = deployments
    const { deployer } = await getNamedAccounts()
    await deploy("Ticket", {
        from: deployer,
        args: [100],
        log: true,
    })
}

module.exports.tags = ["all", "ticket"]
