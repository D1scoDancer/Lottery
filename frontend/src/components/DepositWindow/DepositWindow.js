import React from "react"
import { Table } from "react-bootstrap"
import Deposit from "../Deposit/Deposit"
import "./DepositWindow.css"
import { useAccount, useContractRead } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const DepositWindow = () => {
    const { address, isConnected } = useAccount()

    const call1 = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "round",
        enabled: false,
    })

    const call4 = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "balances",
        args: [call1?.data?.toString(), address],
    })

    const round = () => {
        if (call1.data) {
            return call1?.data?.toString()
        } else {
            return -1
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
                {isConnected ? (
                    <>
                        {(() => {
                            const n = round()
                            const elements = []

                            for (let i = n; i >= 0; i--) {
                                elements.push(
                                    <Deposit round={i} currentRound={round()} address={address} />
                                )
                            }

                            return elements
                        })()}
                    </>
                ) : (
                    <div className="warning">Not connected</div>
                )}
            </tbody>
        </Table>
    )
}

export default DepositWindow
