import React from "react"
import { ConnectKitButton, ChainIcon } from "connectkit"
import { useAccount, useNetwork } from "wagmi"
import "./Connection.css"

const Connection = () => {
    const { chain } = useNetwork()
    const { isConnected } = useAccount()

    return (
        <div className="connection">
            {isConnected ? <ChainIcon id={chain?.id} unsupported={chain?.unsupported} /> : <></>}
            <label className="name">{chain?.name}</label>
            <ConnectKitButton showAvatar={false} />
        </div>
    )
}

export default Connection
