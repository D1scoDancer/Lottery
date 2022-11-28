import React, { useState } from "react"

const ConnectBtn = () => {
    const [buttonTxt, setButtonText] = useState("Connect")

    async function handleClick() {
        if (typeof window.ethereum !== "undefined") {
            try {
                await window.ethereum.request({ method: "eth_requestAccounts" })
            } catch (error) {
                console.log(error)
            }
            setButtonText("Connected!")
            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            })
            console.log(accounts)
        } else {
            setButtonText("Please install MetaMask")
        }
    }

    return (
        <div>
            <button onClick={handleClick}>{buttonTxt}</button>
        </div>
    )
}

export default ConnectBtn
