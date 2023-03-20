const { ethers } = require("hardhat")

const networkConfig = {
    // 31337: {
    //     name: "hardhat",
    //     gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15", // doesn't matter in localhost
    //     callbackGasLimit: "200000",
    //     poolAddressProvider: "0xC911B590248d127aD18546B186cC6B324e99F02c",
    //     depositAssetAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    // },
    31337: {
        // 5
        name: "goerli",
        fee: "0",
        vrfCoordinatorV2: "0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D",
        gasLane: "0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15",
        callbackGasLimit: "100000",
        link: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        poolAddressProvider: "0xC911B590248d127aD18546B186cC6B324e99F02c",
        depositAssetAddress: "0x65aFADD39029741B3b8f0756952C74678c9cEC93", // USDC address
    },
    4002: {
        name: "fantomtest",
        vrfCoordinatorV2: "0xbd13f08b8352A3635218ab9418E340c60d6Eb418",
        gasLane: "0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4",
        subscriptionId: "404", // fake
        callbackGasLimit: "200000",
        poolAddressProvider: "0xC809bea009Ca8DAA680f6A1c4Ca020D550210736",
        depositAssetAddress: "0x84a38cc4B26238EAeDaCfE6AbB66d61631692Bad", // wrong
    },
    43113: {
        name: "fuji",
        vrfCoordinatorV2: "0x2eD832Ba664535e5886b75D64C46EB9a228C2610",
        gasLane: "0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61",
        subscriptionId: "551",
        callbackGasLimit: "200000",
        poolAddressProvider: "0xC911B590248d127aD18546B186cC6B324e99F02c",
        depositAssetAddress: "0x5425890298aed601595a70AB815c96711a31Bc65", // wrong
    },
    43114: {
        name: "avalanche",
        vrfCoordinatorV2: "0xd5D517aBE5cF79B7e95eC98dB0f0277788aFF634",
        gasLane: "0x89630569c9567e43c4fe7b1633258df9f2531b62f2352fa721cf3162ee4ecb46", // 500 gwei Key Hash
        subscriptionId: "404", // fake
        callbackGasLimit: "200000",
    },
}

const developmentChains = ["hardhat", "localhost"]

module.exports = {
    networkConfig,
    developmentChains,
}
