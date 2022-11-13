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

    describe("BuyTicket", async function () {
        it("require msg.value == 0.01 ether", async function () {
            await expect(
                ticket.buyTicket({ value: ethers.utils.parseEther("0.02") })
            ).to.be.revertedWith("1 ticket is 0.01 eth")

            await expect(
                ticket.buyTicket({ value: ethers.utils.parseEther("0.001") })
            ).to.be.revertedWith("1 ticket is 0.01 eth")
        })

        it("user buys 1 ticket for 0.01 eth", async function () {
            const accounts = await ethers.getSigners()
            const account = accounts[1]

            const ticketConnectedContract = await ticket.connect(account)
            await ticketConnectedContract.buyTicket({
                value: ethers.utils.parseEther("0.01"),
            })
            const response = await ticket.balanceOf(account.address)
            assert.equal(response, 1)
            // const balance = await (
            //     await ethers.getContractAt(ticket.address)
            // ).balance
            // assert.equal(balance, 0.01)  // TODO: проверить баланс аккаунта
        })
    })
})
