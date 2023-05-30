import React, { useState, useRef } from "react"
import { Button, Modal, Form, InputGroup, Tooltip, OverlayTrigger } from "react-bootstrap"
import "./DepositButton.css"
import { useAccount } from "wagmi"
import { writeContract } from "@wagmi/core"
import contractAddresses from "../../constants/contractAddresses.json"
import lotteryAbi from "../../constants/abi.json"
import { ethers } from "ethers"

const DepositButton = () => {
    const { isConnected } = useAccount()

    const [show, setShow] = useState(false)
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)

    const inputRef = useRef(null)

    const handleSubmit = (event) => {
        event.preventDefault()
    }

    const sendMoney = async () => {
        if (inputRef?.current?.value) {
            const newValue = ethers.utils.parseEther(inputRef.current.value)
            await writeContract({
                mode: "recklesslyUnprepared",
                address: contractAddresses.LotteryAddress,
                abi: lotteryAbi,
                functionName: "enterLottery",
                overrides: {
                    value: newValue,
                },
            })
            handleClose()
        }
    }

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            Choose MATIC amount to send to the current round
        </Tooltip>
    )

    return (
        <>
            <OverlayTrigger
                placement="right"
                delay={{ show: 150, hide: 150 }}
                overlay={renderTooltip}
            >
                <Button
                    className="depositbutton"
                    onClick={handleShow}
                    variant="dark"
                    disabled={!isConnected}
                >
                    Deposit to Win
                </Button>
            </OverlayTrigger>

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
