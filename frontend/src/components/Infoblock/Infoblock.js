import React from "react"
import "./Infoblock.css"

const Infoblock = () => {
    return (
        <div className="infoblock">
            <h2>Welcome</h2>
            <h4 className="currentRound">Current round: </h4>
            <h4 className="currentState">Current State: </h4>
        </div>
    )
}

export default Infoblock
