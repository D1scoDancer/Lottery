import React from "react"
import Navigation from "../Navigation/Navigation"
import Connection from "../Connection/Connection"
import "./Header.css"

const Header = () => {
    return (
        <header>
            <div className="leftpart">
                {/* <div className="logo">
                    <img src="/logo.png" className="logoimg" />
                </div> */}
                <Navigation />
            </div>
            <div className="rightpart">
                <Connection />
                {/* <Settings /> */}
            </div>
        </header>
    )
}

export default Header
