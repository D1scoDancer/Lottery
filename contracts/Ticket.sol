// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ticket is ERC20 {
    constructor(uint256 initialSupply) ERC20("LTicket", "LTC") {
        _mint(msg.sender, initialSupply);
    }

    receive() external payable {}

    fallback() external {}

    function buyTicket() external payable {
        require(msg.value == 0.01 ether, "1 ticket is 0.01 eth");
        _mint(msg.sender, 1);
    }
}
