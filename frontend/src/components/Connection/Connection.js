import React from "react"
import { ConnectKitButton, ChainIcon } from "connectkit"
import { useNetwork } from "wagmi"
import "./Connection.css"

const Connection = () => {
    const { chain } = useNetwork()

    return (
        <div className="connection">
            <ChainIcon id={chain?.id} unsupported={chain?.unsupported} />
            <label className="name">{chain?.name}</label>
            <ConnectKitButton showAvatar={false} />
        </div>
    )
}

export default Connection
