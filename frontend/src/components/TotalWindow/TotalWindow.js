import React from "react"
import { Container } from "react-bootstrap"
import "./TotalWindow.css"

const TotalWindow = () => {
    return (
        <Container className="totalwindow">
            <div className="poolsize">
                <label>Pool Size:</label>
                <div>40000$</div>
            </div>
            <div className="prize">
                <label>Prize:</label>
                <div>25$</div>
            </div>
            <div className="chances">
                <label>Your chances:</label>
                <div>1.6%</div>
            </div>
        </Container>
    )
}

export default TotalWindow
