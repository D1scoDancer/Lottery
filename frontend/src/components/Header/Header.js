import React from "react"
import Connection from "../Connection/Connection"
import "./Header.css"

const Header = () => {
    return (
        <header>
            <div className="leftpart"></div>
            <div className="rightpart">
                <Connection />
            </div>
        </header>
    )
}

export default Header
