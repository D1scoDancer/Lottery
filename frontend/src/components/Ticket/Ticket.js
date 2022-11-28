import React, { useState } from "react"

// import { ethers } from "../../ethers-5.1.esm.min.js"
// import { abi, contractAddress } from "./constants.js"

const ConnectBtn = () => {
    const [buttonTxt, setButtonText] = useState("Connect")

    async function handleClick() {
        if (typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
            } catch (error) {
                console.log(error)
            }
            setButtonText("Connected!")
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            })
            console.log(accounts)
        } else {
            setButtonText("Please install MetaMask")
        }
    }

    return (
        <div>
            <button onClick={handleClick}>{buttonTxt}</button>
        </div>
    )
}

const TicketShopping = () => {
    return (
        <div>
            <h1>Web3 Lottery</h1>
            <script src="./index.js" type="module"></script>
            {/* <div>
                <button id="connectBtn" onClick={connect}>
                    {" "}
                    Connect{" "}
                </button>
            </div> */}
            <ConnectBtn />
            {/* <div>
                <label for="fund">ETH Amount</label>
                <input id="ethAmount" placeholder="0.1" type="number" />
                <button id="fundBtn"> But </button>
            </div> */}
        </div>
    )
}

export default TicketShopping
