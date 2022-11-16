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
        const ticketFactory = await ethers.getContractFactory("Ticket")
        ticket = await ticketFactory.deploy(initialSupply)
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
})
