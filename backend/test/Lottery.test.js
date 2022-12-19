const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("Lottery", () => {
    let deployer
    let accounts
    let lottery
    const FEE = ethers.utils.parseEther("0.001")
    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer
        accounts = await ethers.getSigners()
        await deployments.fixture(["v2"])
        lottery = await ethers.getContract("Lottery", deployer)
    })

    describe("Constructor", () => {
        it("owner is set", async () => {
            const owner = await lottery.owner()
            assert.equal(owner, deployer)
        })

        it("can call finishLottery() while being an owner", async () => {
            await expect(lottery.finishLottery([])).not.to.be.revertedWith(
                "Ownable: caller is not the owner"
            )
        })

        it("cannot call finishLottery() without being an owner", async () => {
            const user = accounts[1]
            const userConnection = await lottery.connect(user)

            await expect(userConnection.finishLottery([])).to.be.revertedWith(
                "Ownable: caller is not the owner"
            )
        })
    })

    describe("Enter Lottery", () => {})

    describe("Finish Lottery", () => {})
})
