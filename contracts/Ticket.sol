// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Ticket is ERC20 {
    event BuyTickets(uint256 num_tickets);

    constructor(uint256 initialSupply) ERC20("LTicket", "LTC") {
        _mint(msg.sender, initialSupply);
    }

    receive() external payable {}

    fallback() external {}

    function buyTickets() external payable {
        require(msg.value >= 0.01 ether, "1 ticket is 0.01 eth");
        uint256 num_tickets = msg.value / 0.01 ether;
        _mint(msg.sender, num_tickets);
        emit BuyTickets(num_tickets);

        uint256 change = msg.value - num_tickets * 0.01 ether;
        payable(msg.sender).transfer(change);
    }
}
