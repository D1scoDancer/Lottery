import React from "react"
import { Button, Container } from "react-bootstrap"
import DepositButton from "../DepositButton/DepositButton"
import "./ActionWindow.css"

const ActionWindow = () => {
    return (
        <Container className="actionwindow">
            <DepositButton />
        </Container>
    )
}

export default ActionWindow
