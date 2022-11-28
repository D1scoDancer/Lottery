import React from "react"

import { ethers } from "../../ethers-5.1.esm.min.js"
import { abi, contractAddress } from "./constants.js"
import listenForTxMine from "../../utils/ListenForTxMine"

const BuyNumberOfTickets = () => {
    async function handleClick() {
        // const numberOfTickets = document.getElementById("numberOfTickets").value
        const numberOfTickets = 5
        console.log(`Buying ${numberOfTickets} tickets..`)
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            console.log(signer)
            const contract = new ethers.Contract(contractAddress, abi, signer)

            try {
                const txResponse = await contract.BuyNumberOfTickets(5, {
                    // hardcode
                    value: ethers.utils.parseEther("0.5"), // hardcode
                })
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
            />
            <button id="buyNumberOfTicketsBtn" onClick={handleClick}>
                Buy
            </button>
        </div>
    )
}

export default BuyNumberOfTickets
