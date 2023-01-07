import React, { useState } from "react"
import { ethers } from "ethers"
import "./Lottery.css"
import { contractLotteryAddress, LotteryAbi } from "../constants.js"
import listenForTxMine from "../../utils/ListenForTxMine"

const Lottery = () => {
    const [fee, setFee] = useState(0)

    const enterLotteryHandler = () => {}

    const finishLotteryHandler = () => {}

    const getPlayerHandler = () => {}

    const getNumPlayersHandler = () => {}

    const getFEEHandler = async () => {}

    return (
        <div className="lottery">
            <div className="enterLottery">
                <input type="number" />
                <button onClick={enterLotteryHandler} className="storage">
                    Enter Lottery
                </button>
            </div>
            <div className="finishLottery">
                <button onClick={finishLotteryHandler} className="storage">
                    Finish Lottery (only deployer)
                </button>
            </div>
            <hr />
            <div className="getter">
                <input type="number" />
                <button onClick={getPlayerHandler} className="nostorage">
                    Get Player
                </button>
                <label>0x0000</label>
            </div>
            <div className="getter">
                <button onClick={getNumPlayersHandler} className="nostorage">
                    Get NumPlayers
                </button>
                <label>0</label>
            </div>
            <div className="getter">
                <button onClick={getFEEHandler} className="nostorage">
                    Get FEE
                </button>
                <label>0</label>
            </div>
        </div>
    )
}

export default Lottery
