import React from "react"
import "./Infoblock.css"
import { useAccount, useContractRead } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"
import IPoolAbi from "../../constants/IPoolAbi.json"

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
            console.log(`DepositAPY: ${depositAPY * 100}%`)
            const prize = Math.round((totalStake * depositAPY) / 60) // 365 / 6 = 60
            console.log(prize)
            console.log(prize ? "true" : "false")
            if (prize) return parseFloat(ethers.utils.formatEther(prize)).toFixed(8)
        }
        return "~"
    }

    setTotalStake(call2?.data?.toString() || 0)

    return (
        <div className="infoblock">
            <h4 style={{ marginTop: 20 + "px" }}>Current round: {call1?.data?.toString()}</h4>
            <h4 style={{ marginTop: 20 + "px" }}>
                {" "}
                PrizePool right now is: {ethers.utils.formatEther(totalStake)} MATIC{" "}
            </h4>
            <h5> The prize will be: {prize()} MATIC </h5>
            <h6 style={{ marginTop: 20 + "px" }}>
                The winner will be decided in {"5 days 14 hours 15 minutes and 45 seconds"}
            </h6>
        </div>
    )
}

export default Infoblock
