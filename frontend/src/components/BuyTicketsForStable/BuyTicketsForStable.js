import React, { useState } from "react"

import { ethers } from "../../ethers-5.1.esm.min.js"
import {
    contractTicketAddress,
    TicketAbi,
    contractStableAddress,
    StableAbi,
} from "../constants.js"
import listenForTxMine from "../../utils/ListenForTxMine"

/** DEPRECATED */
const BuyTicketsForStable = () => {
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
            const stable = new ethers.Contract(
                contractStableAddress,
                StableAbi,
                signer
            )
            try {
                await stable.approve(contractTicketAddress, 10)
                console.log("Approved!") // Нужна проверка чтобы я не approve больше чем есть на аккаунте
                const txResponse = await contract.buyTicketsForStable(
                    numberOfTickets
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
            <div> Buy Tickets For Stable </div>
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
            <button id="buyTicketsForStableBtn" onClick={handleClick}>
                Buy
            </button>
        </div>
    )
}

export default BuyTicketsForStable
