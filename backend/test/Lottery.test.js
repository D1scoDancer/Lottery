const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("Lottery", () => {
    let deployer
    let accounts
    let lottery
    const FEE = ethers.utils.parseEther("0.001")
    const DOUBLE_FEE = 2 * FEE

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
    })

    describe("Enter Lottery", () => {
        it("can enter with msg.value >= FEE", async () => {
            await expect(
                lottery.enterLottery({ value: DOUBLE_FEE })
            ).not.to.be.revertedWith("Lottery__NotEnoughMoney()")
        })

        it("reverted with custom error when msg.value < FEE", async () => {
            await expect(lottery.enterLottery({ value: 0 })).to.be.revertedWith(
                "Lottery__NotEnoughMoney()"
            )
        })

        it("address gets pushed to s_players list", async () => {
            const numPlayersBefore = await lottery.getNumPayers()
            await lottery.enterLottery({ value: DOUBLE_FEE })
            const numPlayersAfter = await lottery.getNumPayers()
            assert.equal(
                numPlayersAfter.toString(),
                numPlayersBefore.add(1).toString()
            )
        })

        it("event gets emited with correct address", async () => {
            await expect(lottery.enterLottery({ value: DOUBLE_FEE }))
                .to.emit(lottery, "LotteryEntered")
                .withArgs(deployer)
        })

        it("lottery balance increases by msg.value", async () => {
            const lotteryBalanceBefore = await lottery.provider.getBalance(
                lottery.address
            )
            await lottery.enterLottery({ value: DOUBLE_FEE })
            const lotteryBalanceAfter = await lottery.provider.getBalance(
                lottery.address
            )
            assert.equal(
                lotteryBalanceAfter.toString(),
                lotteryBalanceBefore.add(DOUBLE_FEE).toString()
            )
        })
    })

    describe("Finish Lottery", () => {})
})
