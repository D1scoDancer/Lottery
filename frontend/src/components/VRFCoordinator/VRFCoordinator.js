import React, { useState } from "react"
import "./VRFCoordinator.css"
import { contractLotteryAddress, LotteryAbi } from "../constants.js"
import listenForTxMine from "../../utils/ListenForTxMine"

const ethers = require("ethers")

const VRFCoordinator = () => {
    const requestRandomWinner = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(contractLotteryAddress, LotteryAbi, signer)
            try {
                const txResponse = await contract.requestRandomWinner()
                await listenForTxMine(txResponse, provider)
                console.log("requestRandomWinner finished lottery!")
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Install MetaMask")
        }
    }

    return (
        <div className="vrfCoordinator">
            <div className="requestRandomWinner">
                <button onClick={requestRandomWinner} className="storage">
                    requestRandomWinner (~ Finish lottery)
                </button>
            </div>
        </div>
    )
}

export default VRFCoordinator
