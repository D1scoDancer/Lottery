import React, { useEffect } from "react"
import { Container, Table } from "react-bootstrap"
import Deposit from "../Deposit/Deposit"
import "./DepositWindow.css"
import { useAccount, useContractReads } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const DepositWindow = () => {
    const { address, isConnected } = useAccount({
        onConnect({ address, connector, isReconnected }) {
            console.log("Connected", { address, connector, isReconnected })
        },
    })

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
                args: [call1.data.toString(), address],
                enabled: false,
            },
        ],
    })

    return (
        <Container className="depositwindow">
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Asset:</th>
                        <th>Amount:</th>
                    </tr>
                </thead>
                <tbody>
                    <Deposit
                        number={1}
                        asset={"WETH"}
                        // amount={ethers.utils.formatEther(call2.data.toString())}
                        amount={0}
                    />
                    <Deposit number={2} asset={"USDC"} amount={0} />
                </tbody>
            </Table>
        </Container>
    )
}

export default DepositWindow
