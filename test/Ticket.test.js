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

        it("user gets a change after buying tickets", async function () {
            const initial_balance = await ticket.provider.getBalance(
                account.address
            )
            console.log(`Initial balance: ${initial_balance}`)

            const ticketConnectedContract = await ticket.connect(account)

            // User send 0.02 ether for 2 tickets
            await expect(
                (txResponse = await ticketConnectedContract.buyTickets({
                    value: ethers.utils.parseEther("0.02"),
                }))
            )
                .to.emit(ticketConnectedContract, "BuyTickets")
                .withArgs(2)

            const txReceipt = await txResponse.wait()
            const { gasUsed, effectiveGasPrice } = txReceipt
            const gasCost_1 = gasUsed.mul(effectiveGasPrice)
            const balance_1 = await ticket.provider.getBalance(account.address)

            console.log(`After buying 2 tickets: ${balance_1}`)
            console.log(`Spent on gas: ${gasCost_1}`)
            console.log(`Spent on tickets: ${ethers.utils.parseEther("0.02")}`)
            console.log(`Diff balances: ${initial_balance - balance_1}`)
            console.log(
                `Gas + tickets: ${gasCost_1.add(
                    ethers.utils.parseEther("0.02")
                )}`
            ) // TODO: СПРОСИТЬ ПОЧЕМУ НЕ СХОДЯТСЯ ЦИФРЫ!!!

            // User sends 0.15 ether for 1 ticket
            // await expect(
            //     (txResponse_2 = await ticketConnectedContract.buyTickets({
            //         value: ethers.utils.parseEther("0.015"),
            //     }))
            // )
            //     .to.emit(ticketConnectedContract, "BuyTickets")
            //     .withArgs(1)

            // const txReceipt_2 = await txResponse_2.wait()
            // const { gasUsed_2, effectiveGasPrice_2 } = txReceipt_2
            // const gasCost_2 = gasUsed_2.mul(effectiveGasPrice_2)
            // const balance_2 = await ticket.provider.getBalance(account.address)
            // console.log(`After buying third ticket: ${balance_2 + gasCost_2}`)
        })
    })
})
