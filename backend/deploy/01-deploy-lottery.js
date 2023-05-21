const { ethers, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../helper-hardhat-config")
const { verify } = require("../scripts/verify")

const FUND_AMOUNT = ethers.utils.parseEther("1") // 1 Ether, or 1e18 (10^18) Wei

module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    let vrfCoordinatorV2, subscriptionId
    if (chainId == 31337) {
        // create VRFV2 Subscription
        vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        vrfCoordinatorV2 = vrfCoordinatorV2Mock.address
        const transactionResponse = await vrfCoordinatorV2Mock.createSubscription()
        const transactionReceipt = await transactionResponse.wait()
        subscriptionId = transactionReceipt.events[0].args.subId
        // Fund the subscription
        // Our mock makes it so we don't actually have to worry about sending fund
        await vrfCoordinatorV2Mock.fundSubscription(subscriptionId, FUND_AMOUNT)

        const automationMock = await ethers.getContract("AutomationMock")
    } else {
        vrfCoordinatorV2 = networkConfig[chainId]["vrfCoordinatorV2"]
        subscriptionId = networkConfig[chainId]["subscriptionId"]
    }

    const fee = networkConfig[chainId]["fee"]
    const gasLane = networkConfig[chainId]["gasLane"]
    const callbackGasLimit = networkConfig[chainId]["callbackGasLimit"]
    const addressesProvider = networkConfig[chainId]["addressesProvider"]
    const assetAddress = networkConfig[chainId]["assetAddress"]

    const args = [
        fee,
        vrfCoordinatorV2,
        gasLane,
        subscriptionId,
        callbackGasLimit,
        addressesProvider,
        assetAddress,
    ]
    const lottery = await deploy("Lottery", {
        from: deployer,
        args: args,
        log: true,
        waitConfirmations: network.config.blockConfirmations || 5,
    })

    // Ensure the Raffle contract is a valid consumer of the VRFCoordinatorV2Mock contract.
    if (developmentChains.includes(network.name)) {
        const vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
        await vrfCoordinatorV2Mock.addConsumer(subscriptionId, lottery.address)
    }

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API) {
        console.log("Verifying...")
        await verify(lottery.address, args)
    }

    // finish with mocks
    if (chainId == 31337) {
        console.log("Updating AutomationMock...")
        const automationMock = await ethers.getContract("AutomationMock")
        await automationMock.setLottery(lottery.address)
        console.log("AutomationMock updated!")
    }
}

module.exports.tags = ["all", "lottery"]
