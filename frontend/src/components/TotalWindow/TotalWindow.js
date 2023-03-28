import React from "react"
import { Container } from "react-bootstrap"
import "./TotalWindow.css"
import { useAccount, useContractReads } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const TotalWindow = () => {
    const call1 = useContractReads({
        contracts: [
            {
                address: contractAddresses.LotteryAddress,
                abi: lotteryAbi,
                functionName: "round",
            },
        ],
    })

    const call2 = useContractReads({
        contracts: [
            {
                address: contractAddresses.LotteryAddress,
                abi: lotteryAbi,
                functionName: "totalStake",
                args: [call1.data.toString()],
            },
        ],
    })

    return (
        <Container className="totalwindow">
            <div className="poolsize">
                <label>Pool Size:</label>
                <div>{ethers.utils.formatEther(call2.data.toString())}</div>
            </div>
            <div className="prize">
                <label>Prize:</label>
                <div>25$</div>
            </div>
            <div className="chances">
                <label>Your chances:</label>
                <div>1.6%</div>
            </div>
        </Container>
    )
}

export default TotalWindow
