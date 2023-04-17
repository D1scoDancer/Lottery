import React, { useState, useRef } from "react"
import { Button, Modal, Form, InputGroup } from "react-bootstrap"
import "./DepositButton.css"
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const DepositButton = () => {
    const { isConnected } = useAccount()

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const inputRef = useRef(null)

    const { config } = usePrepareContractWrite({
        address: contractAddresses.LotteryAddress,
        abi: lotteryAbi,
        functionName: "enterLottery",
        overrides: {
            value: ethers.utils.parseEther("0.05"),
        },
    })

    const { write } = useContractWrite(config)

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    const sendMoney = () => {
        if (inputRef?.current?.value) {
            const newValue = ethers.utils.parseEther(inputRef.current.value)
            console.log(newValue)
            write({
                recklesslySetUnpreparedOverrides: {
                    value: newValue,
                },
            })
            handleClose()
        }
    }

    return (
        <>
            <Button
                className="depositbutton"
                onClick={handleShow}
                variant="dark"
                disabled={!isConnected}
            >
                Deposit to Win BTN
            </Button>

            <Modal
                className="my-modal"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton closeVariant="white">
                    <Modal.Title>Deposit to WIN</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Bet is a new investment</Form.Label>
                            <Form.Control
                                type="number"
                                ref={inputRef}
                                placeholder="0.0"
                                step="0.001"
                                min="0.0"
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="dark" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="dark" onClick={sendMoney}>
                        Send MATIC
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default DepositButton
