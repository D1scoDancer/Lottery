import React from "react"
import { Container } from "react-bootstrap"

const Deposit = ({ asset, amount, tx }) => {
    return (
        <tr>
            <td>{asset}</td>
            <td>{amount}</td>
            <td>
                <a href="#">{tx}</a>
            </td>
        </tr>
    )
}

export default Deposit
