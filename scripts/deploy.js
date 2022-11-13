// imports
const { ethers, network } = require("hardhat")
require("dotenv").config()

// async main
async function main() {
    const TicketFactory = await ethers.getContractFactory("Ticket")
    console.log("Deploying contract...")
    const ticket = await TicketFactory.deploy(100)
    await ticket.deployed()
    console.log(`Deployed to: ${ticket.address}`)
    
}

main()
    .then(() => process.exit(0))
    .catch((errror) => {
        console.error(errror)
        process.exit(1)
    })
