const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("30")

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    const aaveDeposite = await ethers.getContract("AaveDeposite", deployer)
    const aaveDepositeAddress = aaveDeposite.address
    console.log(`_aaveDeposite param: ${aaveDepositeAddress}`)

    let vrfCoordinatorV2Address, subscriptionId
    if (developmentChains.includes(network.name)) {
        const VRFCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2Address = VRFCoordinatorV2Mock.address
        const txResponse = await VRFCoordinatorV2Mock.createSubscription()
        const txReceipt = await txResponse.wait(1)
        subscriptionId = txReceipt.events[0].args.subId
        await VRFCoordinatorV2Mock.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT)
    } else {
        vrfCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]

    const args = [
        aaveDepositeAddress,
        vrfCoordinatorV2Address,
        gasLane,
        subscriptionId,
        callbackGasLimit,
    ]
    const lottery = await deploy("Lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 1,
    })
}

module.exports.tags = ["all", "lottery"]
