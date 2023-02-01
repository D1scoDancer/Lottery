import React from "react"
import Dropdown from "react-bootstrap/Dropdown"
import "./Settings.css"

const Settings = () => {
    return (
        <Dropdown className="settings">
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                Settings
            </Dropdown.Toggle>

            <Dropdown.Menu>
                <Dropdown.Item href="#/action-1">Dark mode</Dropdown.Item>
                <Dropdown.Item href="#/action-2">Help</Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

export default Settings
