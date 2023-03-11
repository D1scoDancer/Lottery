const { ethers } = require("hardhat")
const { assert, expect } = require("chai")

const fee = ethers.utils.parseEther("0.0001")

describe("Lottery Unit Testing", () => {
    var lottery, deployer
    beforeEach(async () => {
        deployer = (await ethers.getSigners())[0]
        const Factory = await ethers.getContractFactory("Lottery")
        lottery = await Factory.deploy(fee)
    })

    describe("Initialization", () => {
        it("Fee is set", async () => {
            const _fee = await lottery.fee()
            expect(_fee.toString()).to.equal(fee.toString())
        })
    })

    describe("Enter Lottery", () => {
        it("mapping(uint => mapping(address => uint)) balances", async () => {})
        it("mapping(uint => address[]) players", async () => {})
        it("mapping(uint => uint) totalStake", async () => {})
    })
})
