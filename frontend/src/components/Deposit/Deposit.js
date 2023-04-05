import React from "react"
import { Button, Container } from "react-bootstrap"

const Deposit = ({ round, amount }) => {
    return (
        <tr>
            <td>{round}</td>
            <td>{amount} ETH</td>
            <td>
                <Button variant="dark">Withdraw</Button>
            </td>
        </tr>
    )
}

export default Deposit
