import React, { useState } from "react"
import "./Lottery.css"
import { contractLotteryAddress, LotteryAbi } from "../constants.js"
import listenForTxMine from "../../utils/ListenForTxMine"

const ethers = require("ethers")

const Lottery = () => {
    const [lotteryInput, setLotteryInput] = useState(0.001)
    const [seedInput, setSeedInput] = useState("")
    const [playerIndexInput, setPlayerIndexInput] = useState(0)
    const [player, setPlayer] = useState("0x...")
    const [numPlayers, setNumPlayers] = useState("?")
    const [fee, setFee] = useState(0)

    const enterLotteryHandler = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                contractLotteryAddress,
                LotteryAbi,
                signer
            )
            try {
                const txResponse = await contract.enterLottery({
                    value: ethers.utils.parseEther(lotteryInput.toString()),
                })
                await listenForTxMine(txResponse, provider)
                console.log("Entered lottery!")
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Install MetaMask")
        }
    }

    const finishLotteryHandler = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                contractLotteryAddress,
                LotteryAbi,
                signer
            )
            try {
                const txResponse = await contract.finishLottery(
                    ethers.utils.toUtf8Bytes(seedInput)
                )
                await listenForTxMine(txResponse, provider)
                console.log("Finished lottery!")
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Install MetaMask")
        }
    }

    const getPlayerHandler = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                contractLotteryAddress,
                LotteryAbi,
                signer
            )
            try {
                const address = await contract.getPlayer(playerIndexInput)
                setPlayer(address).toString()
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Install MetaMask")
        }
    }

    const getNumPlayersHandler = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                contractLotteryAddress,
                LotteryAbi,
                signer
            )
            try {
                const number = await contract.getNumPlayers()
                setNumPlayers(number.toString())
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Install MetaMask")
        }
    }

    const getFEEHandler = async () => {
        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            const signer = provider.getSigner()
            const contract = new ethers.Contract(
                contractLotteryAddress,
                LotteryAbi,
                signer
            )
            try {
                const FEE = await contract.getFEE()
                setFee(ethers.utils.formatEther(FEE))
            } catch (error) {
                console.log(error)
            }
        } else {
            console.log("Install MetaMask")
        }
    }

    return (
        <div className="lottery">
            <div className="enterLottery">
                <input
                    type="number"
                    value={lotteryInput}
                    onInput={(e) => {
                        setLotteryInput(e.target.value)
                    }}
                />
                <button onClick={enterLotteryHandler} className="storage">
                    Enter Lottery
                </button>
            </div>
            <div className="finishLottery">
                <input
                    value={seedInput}
                    onInput={(e) => {
                        setSeedInput(e.target.value)
                    }}
                />
                <button onClick={finishLotteryHandler} className="storage">
                    Finish Lottery (only deployer)
                </button>
            </div>
            <hr />
            <div className="getter">
                <input
                    type="number"
                    value={playerIndexInput}
                    onInput={(e) => {
                        setPlayerIndexInput(e.target.value)
                    }}
                />
                <button onClick={getPlayerHandler} className="nostorage">
                    Get Player
                </button>
                <label>{player}</label>
            </div>
            <div className="getter">
                <button onClick={getNumPlayersHandler} className="nostorage">
                    Get NumPlayers
                </button>
                <label>{numPlayers}</label>
            </div>
            <div className="getter">
                <button onClick={getFEEHandler} className="nostorage">
                    Get FEE
                </button>
                <label>{fee}</label>
            </div>
        </div>
    )
}

export default Lottery
