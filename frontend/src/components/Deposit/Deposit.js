import React from "react"
import { Button, Container, Tooltip, OverlayTrigger } from "react-bootstrap"
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
        watch: true,
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
            if (totalStake(callForTotalStake) == 0 && amount(callForBalance) == 0) {
                return "100% chance of winning"
            } else {
                return `${Math.round(
                    (amount(callForBalance) / totalStake(callForTotalStake)) * 100
                )}% chance of winning`
            }
        } else {
            return "Round ended"
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

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Works only if status is "Round ended"
        </Tooltip>
    )

    const returnStatement = () => {
        if (currentRound == round || amount(callForBalance) > 0) {
            return (
                <tr>
                    <td>{round}</td>
                    <td>{amount(callForBalance)} MATIC</td>
                    <td>{status()}</td>
                    <td>
                        <OverlayTrigger
                            placement="bottom"
                            delay={{ show: 150, hide: 150 }}
                            overlay={renderTooltip}
                        >
                            <Button
                                variant="dark"
                                disabled={!canWithdraw()}
                                onClick={withdrawHandler}
                            >
                                Withdraw
                            </Button>
                        </OverlayTrigger>
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
