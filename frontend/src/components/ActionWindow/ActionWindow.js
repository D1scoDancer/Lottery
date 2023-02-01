import React from "react"
import { Button, Container } from "react-bootstrap"
import DepositButton from "../DepositButton/DepositButton"
import "./ActionWindow.css"

const ActionWindow = () => {
    return (
        <Container className="actionwindow">
            <DepositButton />
            <div className="subbtns">
                <Button variant="info" size="sm">
                    Get tokens
                </Button>
                <Button variant="info" size="sm">
                    Help
                </Button>
            </div>
        </Container>
    )
}

export default ActionWindow
