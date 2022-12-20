import React, { useState } from "react"

import { ethers } from "../../ethers-5.1.esm.min.js"
import { contractTicketAddress, TicketAbi } from "../constants.js"
import listenForTxMine from "../../utils/ListenForTxMine"

/** DEPRECATED */
const BuyNumberOfTickets = () => {
    const [numberOfTickets, changeNumberOfTickets] = useState(1)

    const handleChange = (event) => {
        changeNumberOfTickets(event.target.value)
    }

    async function handleClick() {
        console.log(`Buying ${numberOfTickets} tickets..`)
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            console.log(signer)
            const contract = new ethers.Contract(
                contractTicketAddress,
                TicketAbi,
                signer
            )

            try {
                const txResponse = await contract.BuyNumberOfTickets(
                    numberOfTickets,
                    {
                        value: ethers.utils.parseEther(
                            (numberOfTickets * 0.01).toString()
                        ),
                    }
                )
                await listenForTxMine(txResponse, provider)
                console.log("Done!")
            } catch (error) {
                console.log(error)
            }
        }
    }

    return (
        <div>
            <label> Number of tickets </label>
            <input
                id="numberOfTickets"
                placeholder="1"
                type="number"
                min="1"
                step="1"
                onChange={handleChange}
                value={numberOfTickets}
            />
            <button id="buyNumberOfTicketsBtn" onClick={handleClick}>
                Buy
            </button>
        </div>
    )
}

export default BuyNumberOfTickets
