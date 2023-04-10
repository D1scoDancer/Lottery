import React, { useEffect } from "react"
import { Container, Table } from "react-bootstrap"
import Deposit from "../Deposit/Deposit"
import "./DepositWindow.css"
import { useAccount, useContractReads } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const DepositWindow = () => {
    const { address, isConnected } = useAccount()

    const call1 = useContractReads({
        contracts: [
            {
                address: contractAddresses.LotteryAddress,
                abi: lotteryAbi,
                functionName: "round",
                enabled: false,
            },
        ],
    })

    const call2 = useContractReads({
        contracts: [
            {
                address: contractAddresses.LotteryAddress,
                abi: lotteryAbi,
                functionName: "balances",
                args: [call1?.data?.toString(), address],
                enabled: false,
            },
        ],
    })

    const amount = (call2) => {
        if (call2.data) {
            return ethers.utils.formatEther(call2?.data?.toString())
        } else {
            return "~"
        }
    }

    const status = () => {
        return "PASS"
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
                    <th>My prize:</th>
                    <th>_________</th>
                    <th>Can withdraw</th>
                    <th>btn</th>
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
