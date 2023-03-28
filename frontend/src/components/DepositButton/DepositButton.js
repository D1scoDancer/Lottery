import React from "react"
import { Button } from "react-bootstrap"
import "./DepositButton.css"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const DepositButton = () => {
    const { config } = usePrepareContractWrite({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "enterLottery",
        overrides: {
            value: ethers.utils.parseEther("0.05"),
        },
    })

    const { write } = useContractWrite(config)

    return (
        <Button className="depositbutton" onClick={write}>
            Deposit to Win BTN
        </Button>
    )
}

export default DepositButton
