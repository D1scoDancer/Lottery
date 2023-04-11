import React, { useState } from "react"
import ActionWindow from "../ActionWindow/ActionWindow"
import DepositWindow from "../DepositWindow/DepositWindow"
import Infoblock from "../Infoblock/Infoblock"
import "./Main.css"

const Main = () => {
    const [totalStake, setTotalStake] = useState(0)

    return (
        <main>
            <Infoblock totalStake={totalStake} setTotalStake={setTotalStake} />
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
