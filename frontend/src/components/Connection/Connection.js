import React from "react"
import { ConnectKitButton, ChainIcon } from "connectkit"
import { useAccount, useNetwork } from "wagmi"
import "./Connection.css"
import { Tooltip, OverlayTrigger } from "react-bootstrap"

const Connection = () => {
    const { chain } = useNetwork()
    const { isConnected } = useAccount()

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Currently, the supported chain is limited to Polygon Mumbai
        </Tooltip>
    )

    return (
        <div className="connection">
            {isConnected ? <ChainIcon id={chain?.id} unsupported={chain?.unsupported} /> : <></>}
            <OverlayTrigger
                placement="bottom"
                delay={{ show: 150, hide: 150 }}
                overlay={renderTooltip}
            >
                <label className="name">{chain?.name}</label>
            </OverlayTrigger>
            <ConnectKitButton showAvatar={false} />
        </div>
    )
}

export default Connection
