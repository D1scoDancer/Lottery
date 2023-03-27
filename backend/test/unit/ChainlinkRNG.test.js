const { ethers, network } = require("hardhat")
const { expect } = require("chai")
const { developmentChains } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("ChainlinkRNG Unit tests", () => {})
