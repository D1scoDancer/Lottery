const { ethers } = require("hardhat")

const networkConfig = {
    5: {
        name: "goerli",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        // entranceFee: ethers.utils.parseEther("0.001"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        subscriptionId: "8426",
        callbackGasLimit: "500000", // its random !CHANGE!
        // interval: 60,
    },
    31337: {
        name: "hardhat",
        // entranceFee: ethers.utils.parseEther("10"),
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // doesn't matter in localhost
        callbackGasLimit: "500000",
        // interval: 60,
    },
    4002: {
        name: "fantomtest",
        vrfCoordinatorV2: "0xbd13f08b8352A3635218ab9418E340c60d6Eb418",
        // entranceFee: ethers.utils.parseEther("0.001"),
        gasLane: "0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4",
        subscriptionId: "8426", // probably should change
        callbackGasLimit: "500000", // its random !CHANGE!
    },
    43113: {
        name: "fuji",
        vrfCoordinatorV2: "0x2eD832Ba664535e5886b75D64C46EB9a228C2610",
        // entranceFee: ethers.utils.parseEther("0.001"),
        gasLane: "0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61",
        subscriptionId: "8426", // probably should change
        callbackGasLimit: "500000", // its random !CHANGE!
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
