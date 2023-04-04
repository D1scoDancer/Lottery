const {
    frontEndContractsFile,
    frontEndAbiFile,
    networkConfig,
} = require("../helper-hardhat-config")
const fs = require("fs")
const { network, ethers } = require("hardhat")
require("dotenv").config()

const chainId = network.config.chainId

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END === "true") {
        console.log("Writing to front end...")
        await updateLotteryAddress()
        await updateAbi()
        console.log("Front end written!")
    }
}

async function updateAbi() {
    const lottery = await ethers.getContract("Lottery")
    fs.writeFileSync(frontEndAbiFile, lottery.interface.format(ethers.utils.FormatTypes.json))
}

async function updateLotteryAddress() {
    const lottery = await ethers.getContract("Lottery")
    const poolAddress = await lottery.POOL()
    const obj = {
        LotteryAddress: lottery.address,
        PoolAddress: poolAddress,
        AssetAddress: networkConfig[chainId]["assetAddress"],
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(obj))
}
module.exports.tags = ["all", "frontend"]
