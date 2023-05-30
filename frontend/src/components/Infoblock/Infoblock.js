import React from "react"
import "./Infoblock.css"
import { useAccount, useContractRead } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { BigNumber, ethers } from "ethers"
import IPoolAbi from "../../constants/IPoolAbi.json"
import CountdownTimer from "../CountdownTimer/CountdownTimer"
import { Tooltip, OverlayTrigger } from "react-bootstrap"

const RAY = 10 ** 27 // 10 to the power 27
const SECONDS_PER_YEAR = 31536000

const Infoblock = ({ totalStake, setTotalStake }) => {
    const { address, isConnected } = useAccount()

    const call1 = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "round",
    })

    const call2 = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "totalStake",
        args: [call1?.data?.toString()],
        watch: true,
    })

    const call3 = useContractRead({
        address: contractAddresses.PoolAddress,
        abi: IPoolAbi,
        functionName: "getReserveData",
        args: [contractAddresses.AssetAddress],
    })

    const prize = () => {
        if (call3) {
            const currentLiquidityRate = call3?.data?.currentLiquidityRate
            const depositAPR = currentLiquidityRate / RAY
            const depositAPY = (1 + depositAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1
            const prize = Math.round((totalStake * depositAPY) / 60) // 365 / 6 = 60

            if (prize) {
                const bigNumberPrize = BigNumber.from(prize.toString())
                return parseFloat(ethers.utils.formatEther(bigNumberPrize)).toFixed(6)
            }

            return "0"
        }
        return "~"
    }

    const callForState = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "states",
        args: [call1?.data?.toString()],
        watch: true,
    })

    const currentState = () => {
        if (callForState) {
            switch (callForState?.data?.toString()) {
                case "0":
                    return "OPEN_FOR_DEPOSIT"
                case "1":
                    return "WORKING"
                case "2":
                    return "OPEN_FOR_WITHDRAW"
                default:
                    return "UNDEFINED"
            }
        }
        return "???"
    }

    setTotalStake(call2?.data?.toString() || 0)

    const renderTooltipForTimer = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            State changes occur at 00:00 UTC every Tuesday and Wednesday
        </Tooltip>
    )

    const renderTooltipForPrize = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            This value is approximate based on the current APY rate
        </Tooltip>
    )

    const renderTooltipForRoundStatus = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {currentState()}
        </Tooltip>
    )

    return (
        <div className="infoblock">
            <OverlayTrigger
                placement="top"
                delay={{ show: 150, hide: 150 }}
                overlay={renderTooltipForRoundStatus}
            >
                <h4 style={{ marginTop: 20 + "px" }}>Current round: {call1?.data?.toString()}</h4>
            </OverlayTrigger>
            <h4 style={{ marginTop: 20 + "px" }}>
                {" "}
                PrizePool right now is: {ethers.utils.formatEther(totalStake)} MATIC{" "}
            </h4>
            <OverlayTrigger
                placement="right"
                delay={{ show: 150, hide: 150 }}
                overlay={renderTooltipForPrize}
            >
                <h5> The prize will be: {prize()} MATIC </h5>
            </OverlayTrigger>
            <OverlayTrigger
                placement="right"
                delay={{ show: 150, hide: 150 }}
                overlay={renderTooltipForTimer}
            >
                <h6 style={{ marginTop: 20 + "px" }}>
                    <CountdownTimer />
                </h6>
            </OverlayTrigger>
        </div>
    )
}

export default Infoblock
