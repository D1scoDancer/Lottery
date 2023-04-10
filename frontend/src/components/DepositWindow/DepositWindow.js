import React from "react"
import { Table } from "react-bootstrap"
import Deposit from "../Deposit/Deposit"
import "./DepositWindow.css"
import { useAccount, useContractRead } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const DepositWindow = ({ totalStake }) => {
    const { address, isConnected } = useAccount()

    const call1 = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "round",
        enabled: false,
    })

    const call2 = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "balances",
        args: [call1?.data?.toString(), address],
        enabled: false,
    })

    const call4 = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "balances",
        args: [call1?.data?.toString(), address],
    })

    const amount = (call2) => {
        if (call2.data) {
            return ethers.utils.formatEther(call2?.data?.toString())
        } else {
            return "~"
        }
    }

    const status = () => {
        // didn't win
        // WINNER
        // x% chance of wining
        if (isConnected) {
            console.log(call1)
            // x% chance of wining
            if (totalStake == 0) {
                return "100% chance of winning"
            } else {
                return `${Math.round(
                    (call4?.data?.toString() / totalStake) * 100
                )}% chance of winning`
            }
        } else {
            return ""
        }
    }

    const canWithdraw = () => {
        return false
    }

    return (
        <Table striped hover variant="dark">
            <thead>
                <tr>
                    <th>Round:</th>
                    <th>Amount:</th>
                    <th>Status:</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {isConnected && call2 ? (
                    <Deposit
                        round={0}
                        amount={amount(call2)}
                        status={status()}
                        prize={0}
                        canWithdraw={canWithdraw()}
                    />
                ) : (
                    <div className="warning">Not connected</div>
                )}
            </tbody>
        </Table>
    )
}

export default DepositWindow
