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
            <div className="twoblocks">
                <div className="leftblock">
                    <label>Your deposits</label>
                    <DepositWindow />
                </div>
                <div className="rightblock">
                    <label>Total deposit</label>
                    <TotalWindow />
                </div>
            </div>
            <div className="actionblock">
                <ActionWindow />
            </div>
        </main>
    )
}

export default Main
