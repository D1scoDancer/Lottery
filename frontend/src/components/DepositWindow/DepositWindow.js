import React from "react"
import { Container, Table } from "react-bootstrap"
import Deposit from "../Deposit/Deposit"
import "./DepositWindow.css"

const DepositWindow = () => {
    return (
        <Container className="depositwindow">
            <Table striped hover>
                <thead>
                    <tr>
                        <th>Asset:</th>
                        <th>Amount:</th>
                        <th>tx</th>
                    </tr>
                </thead>
                <tbody>
                    <Deposit
                        number={1}
                        asset={"USDT"}
                        amount={110}
                        tx={"0x13..785"}
                    />
                    <Deposit
                        number={2}
                        asset={"USDC"}
                        amount={50}
                        tx={"0xfe..53a"}
                    />
                </tbody>
            </Table>
        </Container>
    )
}

export default DepositWindow
