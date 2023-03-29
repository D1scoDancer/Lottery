import React from "react"
import { Container } from "react-bootstrap"
import "./TotalWindow.css"
import { useAccount, useContractRead } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"
import IPoolAbi from "../../constants/IPoolAbi.json"

const RAY = 10 ** 27 // 10 to the power 27
const SECONDS_PER_YEAR = 31536000

const TotalWindow = () => {
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

    const call4 = useContractRead({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "balances",
        args: [call1?.data?.toString(), address],
    })

    const totalStake = call2?.data?.toString() || 0

    const prize = () => {
        if (call3) {
            const currentLiquidityRate = call3?.data?.currentLiquidityRate
            const depositAPR = currentLiquidityRate / RAY

            const depositAPY = (1 + depositAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1
            console.log(`DepositAPY: ${depositAPY * 100}%`)
            const prize = Math.round((totalStake * depositAPY) / 60) // 365 / 6 = 60
            return parseFloat(ethers.utils.formatEther(prize)).toFixed(8)
        } else {
            return "~"
        }
    }

    return (
        <Container className="totalwindow">
            <div className="poolsize">
                <label>Pool Size:</label>
                <div>{ethers.utils.formatEther(totalStake)} ETH</div>
            </div>
            <div className="prize">
                <label>Prize:</label>
                <div>{prize()} ETH</div>
            </div>
            <div className="chances">
                <label>Your chances:</label>
                {isConnected ? (
                    <div>
                        {totalStake == 0
                            ? "100%"
                            : `${Math.round((call4?.data?.toString() / totalStake) * 100)} %`}
                    </div>
                ) : (
                    <>Not connected</>
                )}
            </div>
        </Container>
    )
}

export default TotalWindow
