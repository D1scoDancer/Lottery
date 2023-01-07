import React, { useState } from "react"
import { ethers } from "../../ethers-5.1.esm.min.js"

const AccountBalance = () => {
    const [balance, setBalance] = useState(0)

    async function getBalance() {}

    return (
        <div>
            <h3>AccountBalance</h3>
            <div>{balance}</div>
        </div>
    )
}

export default AccountBalance
