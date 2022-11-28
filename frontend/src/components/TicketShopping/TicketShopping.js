import React from "react"

import ConnectBtn from "../ConnectBtn/ConnectBtn"
import BuyNumberOfTickets from "../BuyNumberOfTickets/BuyNumberOfTickets"

const TicketShopping = () => {
    return (
        <div>
            <h1>Web3 Lottery</h1>
            <script src="./index.js" type="module"></script>{" "}
            {/* Нужно ли это? */}
            <ConnectBtn />
            <BuyNumberOfTickets />
        </div>
    )
}

export default TicketShopping
