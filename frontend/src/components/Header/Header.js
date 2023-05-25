import React from "react"
import Connection from "../Connection/Connection"
import "./Header.css"
import { Image } from "react-bootstrap"

const Header = () => {
    return (
        <header>
            <div className="leftpart">
                <Image
                    src={process.env.PUBLIC_URL + "/psps_logo.png"}
                    width={180}
                    style={{ marginLeft: 20 + "px" }}
                />
            </div>
            <div className="rightpart">
                <Connection />
            </div>
        </header>
    )
}

export default Header
