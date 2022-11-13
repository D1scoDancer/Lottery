const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts } = require("hardhat")

describe("Ticket", async function () {
    let ticket
    let deployer
    const initialSupply = 100
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        const ticketFactory = await ethers.getContractFactory("Ticket")
        ticket = await ticketFactory.deploy(initialSupply)
    })

    describe("Constructor", async function () {
        it("deployer has LTC tokens", async function () {
            const response = await ticket.balanceOf(deployer)
            assert.equal(response, initialSupply)
        })
    })
})
