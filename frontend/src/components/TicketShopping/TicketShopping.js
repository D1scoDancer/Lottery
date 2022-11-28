import React from "react"

import ConnectBtn from "../ConnectBtn/ConnectBtn"

// import { ethers } from "../../ethers-5.1.esm.min.js"
// import { abi, contractAddress } from "./constants.js"

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
