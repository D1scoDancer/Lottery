const { ethers } = require("hardhat")
const { expect } = require("chai")

const fee = ethers.utils.parseEther("0.0001")
const enterValue = ethers.utils.parseEther("0.1")

describe("Lottery Unit Testing", () => {
    var lottery, deployer, user, userConnection
    beforeEach(async () => {
        signers = await ethers.getSigners()
        deployer = signers[0]
        user = signers[1]
        const Factory = await ethers.getContractFactory("Lottery")
        lottery = await Factory.deploy(fee)
        userConnection = lottery.connect(user)
    })

    describe("Initialization", () => {
        it("Fee is set", async () => {
            const _fee = await lottery.fee()
            expect(_fee.toString()).to.equal(fee.toString())
        })
    })

    describe("Enter Lottery", () => {
        it("mapping balances changes", async () => {
            const balance = await lottery.balances(0, deployer.address)
            expect(balance.toString()).to.equal("0")

            await lottery.enterLottery({ value: enterValue })

            const balanceAfter = await lottery.balances(0, deployer.address)
            expect(balanceAfter.toString()).to.equal(enterValue.sub(fee).toString())
        })

        it("mapping players changes", async () => {
            await lottery.enterLottery({ value: enterValue })
            const address = await lottery.players(0, 0)
            expect(address).to.equal(deployer.address)
        })

        it("mapping totalStake changes", async () => {
            const totalStakeBefore = await lottery.totalStake(0)
            expect(totalStakeBefore.toString()).to.equal("0")

            await lottery.enterLottery({ value: enterValue })

            const totalStakeAfter = await lottery.totalStake(0)
            expect(totalStakeAfter.toString()).to.equal(
                totalStakeBefore.add(enterValue).sub(fee).toString()
            )
        })

        it("contract balance changes", async () => {
            const balanceBefore = await lottery.provider.getBalance(lottery.address)
            expect(balanceBefore.toString()).to.equal("0")

            await lottery.enterLottery({ value: enterValue })

            const balanceAfter = await lottery.provider.getBalance(lottery.address)
            expect(balanceAfter.toString()).to.equal(balanceBefore.add(enterValue).toString())
        })

        it("fee is not paid if player exists", async () => {
            await lottery.enterLottery({ value: enterValue })
            const totalStakeBefore = await lottery.totalStake(0)
            expect(totalStakeBefore.toString()).to.equal(enterValue.sub(fee).toString())

            await lottery.enterLottery({ value: enterValue })

            const totalStakeAfter = await lottery.totalStake(0)
            expect(totalStakeAfter.toString()).to.equal(totalStakeBefore.add(enterValue).toString())
        })
    })

    describe("Ownable", () => {
        it("Owner is set", async () => {
            const owner = await lottery.owner()
            expect(owner).to.be.equal(deployer.address)
        })

        it("Only owner can togglePause()", async () => {
            expect(userConnection.togglePause()).to.be.revertedWith(
                "Ownable: caller is not the owner"
            )
            expect(lottery.togglePause()).not.to.be.revertedWith("Ownable: caller is not the owner")
        })
    })

    describe("Pausable", () => {
        it("Pause is set", async () => {
            const paused = await lottery.paused()
            expect(paused).to.be.false
        })

        it("EnterLottery is not accessible when contract is paused", async () => {
            expect(lottery.enterLottery({ value: enterValue })).not.to.be.revertedWith(
                "Pausable: paused"
            )
            await lottery.togglePause()
            expect(lottery.enterLottery({ value: enterValue })).to.be.revertedWith(
                "Pausable: paused"
            )
        })
    })

    describe("Changing States", () => {
        it("togglePause() changes currentState", async () => {
            const currentStateBefore = await lottery.currentState()

            await lottery.togglePause()

            const currentStateAfter = await lottery.currentState()
            expect(currentStateAfter.toString()).to.not.equal(currentStateBefore.toString())
        })

        it("togglePause() changes previousState", async () => {
            await lottery.togglePause()

            const previousStateBefore = await lottery.previousState()

            await lottery.togglePause()

            const previousStateAfter = await lottery.previousState()
            expect(previousStateAfter.toString()).to.not.equal(previousStateBefore.toString())
        })
    })
})
