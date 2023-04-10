import React from "react"
import ActionWindow from "../ActionWindow/ActionWindow"
import DepositWindow from "../DepositWindow/DepositWindow"
import Infoblock from "../Infoblock/Infoblock"
import TotalWindow from "../TotalWindow/TotalWindow"
import "./Main.css"

const Main = () => {
    return (
        <main>
            <Infoblock />
            <div className="depositblock">
                <h5>Your deposits</h5>
                <DepositWindow />
            </div>
            <div className="actionblock">
                <ActionWindow />
            </div>
        </main>
    )
}

export default Main
