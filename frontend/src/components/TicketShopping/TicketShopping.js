import React from "react"

import ConnectBtn from "../ConnectBtn/ConnectBtn"
import AccountStats from "../AccountStats/AccountStats"
import Lottery from "../Lottery/Lottery"

const TicketShopping = () => {
    return (
        <div>
            <h1>Web3 Lottery</h1>
            <script src="./index.js" type="module"></script>{" "}
            {/* Нужно ли это? */}
            <hr />
            <ConnectBtn />
            <AccountStats />
            <hr />
            <Lottery />
            <hr />
        </div>
    )
}

export default TicketShopping
