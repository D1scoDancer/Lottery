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

    return (
        <Container className="depositwindow">
            <Table striped hover variant="dark">
                <thead>
                    <tr>
                        <th>Round:</th>
                        <th>Amount:</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {isConnected && call2 ? (
                        <Deposit round={0} amount={amount(call2)} />
                    ) : (
                        <>Not connected</>
                    )}
                </tbody>
            </Table>
        </Container>
    )
}

export default DepositWindow
