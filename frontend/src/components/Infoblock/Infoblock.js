import React from "react"
import "./Infoblock.css"

const Infoblock = () => {
    return (
        <div className="infoblock">
            <h4 style={{ marginTop: 20 + "px" }}>Current round: </h4>
            <h4 style={{ marginTop: 20 + "px" }}> PrizePool right now is: {1400} MATIC </h4>
            <h5> The prize will be: {10} MATIC </h5>
            <h6 style={{ marginTop: 20 + "px" }}>
                The winner will be decided in {"5 days 14 hours 15 minutes and 45 seconds"}
            </h6>
        </div>
    )
}

export default Infoblock
