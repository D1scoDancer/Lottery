import React, { useState } from "react"
import { ethers } from "../../ethers-5.1.esm.min.js"

const AccountAddress = () => {
    const [address, setAddress] = useState("0x...")



    return (
        <div>
            <h3>AccountAddress</h3>
            <div>{address}</div>
        </div>
    )
}

export default AccountAddress
