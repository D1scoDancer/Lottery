import React from "react"
import "./Footer.css"
import { Image } from "react-bootstrap"
import contractAddresses from "../../constants/contractAddresses.json"

const Footer = () => {
    const etherscanLink = `https://mumbai.polygonscan.com/address/${contractAddresses.LotteryAddress}#code`
    const githubLink = `https://github.com/D1scoDancer/Lottery`

    return (
        <div className="footer">
            <a href={etherscanLink} target="_blank">
                <Image
                    src={process.env.PUBLIC_URL + "/polygonscan.png"}
                    width={100}
                    style={{ marginRight: 20 + "px", marginBottom: 10 + "px" }}
                />
            </a>

            <a href={githubLink} target="_blank">
                <Image
                    src={process.env.PUBLIC_URL + "/GitHub-Logo.png"}
                    width={90}
                    style={{ marginRight: 10 + "px", marginBottom: 20 + "px" }}
                />
            </a>
        </div>
    )
}

export default Footer
