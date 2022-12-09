const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("Ticket", async function () {
    let ticket
    let deployer
    let user
    const initialSupply = 100
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        user = (await getNamedAccounts()).user
        await deployments.fixture(["all"])
        // const ticketFactory = await ethers.getContractFactory("Ticket")
        // ticket = await ticketFactory.deploy(initialSupply)
        ticket = await ethers.getContract("Ticket", deployer)
    })

    describe("Constructor", async function () {
        it("deployer has LTC tokens", async function () {
            const response = await ticket.balanceOf(deployer)
            assert.equal(response, initialSupply)
        })

        it("user doesn't have LTC tokens", async function () {
            const response = await ticket.balanceOf(user)
            assert.equal(response, 0)
        })
    })

    describe("buyTickets", async function () {
        let account
        beforeEach(async function () {
            const accounts = await ethers.getSigners()
            account = accounts[1]
        })

        it("require msg.value == 0.01 ether", async function () {
            await expect(
                ticket.buyTickets({ value: ethers.utils.parseEther("0.001") })
            ).to.be.revertedWith("1 ticket is 0.01 eth")
        })

        it("user buys 1 ticket for 0.01 eth", async function () {
            const ticketConnectedContract = await ticket.connect(account)
            await ticketConnectedContract.buyTickets({
                value: ethers.utils.parseEther("0.01"),
            })
            const response = await ticket.balanceOf(account.address)
            assert.equal(response, 1)

            const balance = await ticket.provider.getBalance(ticket.address)
            assert.equal(
                balance.toString(),
                ethers.utils.parseEther("0.01").toString()
            )
        })

        it("user buys 2 tickets for 0.02 eth", async function () {
            const initial_balance = await ticket.provider.getBalance(
                account.address
            )

            const ticketConnectedContract = await ticket.connect(account)

            await expect(
                (txResponse = await ticketConnectedContract.buyTickets({
                    value: ethers.utils.parseEther("0.02"),
                }))
            )
                .to.emit(ticketConnectedContract, "BuyTickets")
                .withArgs(2)

            const txReceipt = await txResponse.wait()
            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const balance = await ticket.provider.getBalance(account.address)

            const expected = initial_balance
                .sub(gasCost)
                .sub(ethers.utils.parseEther("0.02"))

            assert.equal(expected.toString(), balance.toString())
        })

        it("user gets a change after buying 1 ticket for 0.015 eth", async function () {
            const initial_balance = await ticket.provider.getBalance(
                account.address
            )

            const ticketConnectedContract = await ticket.connect(account)

            await expect(
                (txResponse = await ticketConnectedContract.buyTickets({
                    value: ethers.utils.parseEther("0.015"),
                }))
            )
                .to.emit(ticketConnectedContract, "BuyTickets")
                .withArgs(1)

            const txReceipt = await txResponse.wait()
            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const balance = await ticket.provider.getBalance(account.address)
            const expected = initial_balance
                .sub(gasCost)
                .sub(ethers.utils.parseEther("0.01"))

            assert.equal(expected.toString(), balance.toString())
        })
    })

    describe("BuyNumberOfTickets", async function () {
        let account
        beforeEach(async function () {
            const accounts = await ethers.getSigners()
            account = accounts[1]
        })

        it("user buys 11 tickets for 0.11 eth", async function () {
            const initial_balance = await ticket.provider.getBalance(
                account.address
            )

            const ticketConnectedContract = await ticket.connect(account)

            await expect(
                (txResponse = await ticketConnectedContract.BuyNumberOfTickets(
                    11,
                    {
                        value: ethers.utils.parseEther("0.11"),
                    }
                ))
            )
                .to.emit(ticketConnectedContract, "BuyTickets")
                .withArgs(11)

            const txReceipt = await txResponse.wait()
            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const balance = await ticket.provider.getBalance(account.address)

            const expected = initial_balance
                .sub(gasCost)
                .sub(ethers.utils.parseEther("0.11"))

            assert.equal(expected.toString(), balance.toString())
        })

        it("user gets a change after buying 10 ticket for 1 eth", async function () {
            const initial_balance = await ticket.provider.getBalance(
                account.address
            )

            const ticketConnectedContract = await ticket.connect(account)

            await expect(
                (txResponse = await ticketConnectedContract.BuyNumberOfTickets(
                    10,
                    {
                        value: ethers.utils.parseEther("1"),
                    }
                ))
            )
                .to.emit(ticketConnectedContract, "BuyTickets")
                .withArgs(10)

            const txReceipt = await txResponse.wait()
            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost = gasUsed.mul(effectiveGasPrice)
            const balance = await ticket.provider.getBalance(account.address)

            const expected = initial_balance
                .sub(gasCost)
                .sub(ethers.utils.parseEther("0.1"))

            assert.equal(expected.toString(), balance.toString())
        })
    })

    describe("StableCoinMock", async () => {
        let stable
        beforeEach(async () => {
            const stableFactory = await ethers.getContractFactory(
                "StableCoinMock"
            )
            stable = await stableFactory.deploy(initialSupply)
        })

        it("deploys 100 stable tokens", async () => {
            const balance = await stable.balanceOf(deployer)
            assert.equal(balance.toString(), initialSupply.toString())
        })

        it("can transfer from deployer to user", async () => {
            await stable.transfer(user, 10)
            const userBalance = await stable.balanceOf(user)
            const deployerBalance = await stable.balanceOf(deployer)
            assert.equal(userBalance.toString(), "10")
            assert.equal(deployerBalance.toString(), "90")
        })
    })
    describe("buyTicketsForStable", () => {
        //TODO: change 10 for const
        let stable
        beforeEach(async () => {
            const stableFactory = await ethers.getContractFactory(
                "StableCoinMock"
            )
            stable = await stableFactory.deploy(initialSupply)
        })

        it("can transfer stables", async () => {
            const deployerBalanceBefore = await stable.balanceOf(deployer) // 100
            const contractBalanceBefore = await stable.balanceOf(ticket.address) // 0

            await stable.approve(ticket.address, 10)
            await ticket.buyTicketsForStable(10)

            const deployerBalanceAfter = await stable.balanceOf(deployer) // 90
            const contractBalanceAfter = await stable.balanceOf(ticket.address) // 10

            assert.equal(
                deployerBalanceAfter.toString(),
                deployerBalanceBefore.sub(10).toString()
            )
            assert.equal(
                contractBalanceAfter.toString(),
                contractBalanceBefore.add(10).toString()
            )
        })
        it("mints new tickets", async () => {
            const deployerBalanceBefore = await ticket.balanceOf(deployer) // 100

            await stable.approve(ticket.address, 10)
            await ticket.buyTicketsForStable(10)

            const deployerBalanceAfter = await ticket.balanceOf(deployer) // 10
            assert.equal(
                deployerBalanceAfter.toString(),
                deployerBalanceBefore.add(10).toString()
            )
        })
    })
})
