import React from "react"
import { Button, Container } from "react-bootstrap"

const Deposit = ({ round, amount, status, canWithdraw }) => {
    return (
        <tr>
            <td>{round}</td>
            <td>{amount} MATIC</td>
            <td>{status}</td>
            <td>
                <Button variant="dark" disabled={!canWithdraw}>
                    Withdraw
                </Button>
            </td>
        </tr>
    )
}

export default Deposit
