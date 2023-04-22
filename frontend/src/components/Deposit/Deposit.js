import React from "react"
import { Button, Container } from "react-bootstrap"
import { useContractRead, usePrepareContractWrite, useContractWrite } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const Deposit = ({ round, currentRound, address }) => {
    const callForBalance = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "balances",
        args: [round, address],
        watch: true,
    })

    const amount = (callForBalance) => {
        if (callForBalance.data) {
            return ethers.utils.formatEther(callForBalance?.data?.toString())
        } else {
            return "~"
        }
    }

    const callForTotalStake = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "totalStake",
        args: [round],
    })

    const totalStake = (callForTotalStake) => {
        if (callForTotalStake.data) {
            return ethers.utils.formatEther(callForTotalStake?.data?.toString())
        } else {
            return 0
        }
    }

    const callForState = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "states",
        args: [round],
    })

    const canWithdraw = () => {
        if (callForState) {
            switch (callForState?.data?.toString()) {
                case "0":
                case "1":
                    return false
                case "2":
                    return true
                default:
                    return false
            }
        }
    }

    const isCurrentRound = () => {
        return round == currentRound
    }

    const status = () => {
        if (isCurrentRound()) {
            // x% chance of wining
            if (totalStake(callForTotalStake) == 0) {
                return "100% chance of winning"
            } else {
                return `${Math.round(
                    (amount(callForBalance) / totalStake(callForTotalStake)) * 100
                )}% chance of winning`
            }
        } else {
            // didn't win
            // WINNER
            return "Not current round"
        }
    }

    const { config } = usePrepareContractWrite({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "withdrawFromRound",
        args: [round],
    })
    const { write } = useContractWrite(config)

    const withdrawHandler = () => {
        write()
    }

    const returnStatement = () => {
        if (currentRound == round || amount(callForBalance) > 0) {
            return (
                <tr>
                    <td>{round}</td>
                    <td>{amount(callForBalance)} MATIC</td>
                    <td>{status()}</td>
                    <td>
                        <Button variant="dark" disabled={!canWithdraw()} onClick={withdrawHandler}>
                            Withdraw
                        </Button>
                    </td>
                </tr>
            )
        } else {
            return <></>
        }
    }

    return returnStatement()
}

export default Deposit
