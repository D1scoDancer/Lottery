const { frontEndContractsFile, frontEndAbiFile } = require("../helper-hardhat-config")
const fs = require("fs")
const { network } = require("hardhat")
require("dotenv").config()

module.exports = async () => {
    if (process.env.UPDATE_FRONT_END) {
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
    const obj = {
        LotteryAddress: lottery.address,
    }
    fs.writeFileSync(frontEndContractsFile, JSON.stringify(obj))
}
module.exports.tags = ["all", "frontend"]
