// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Ticket is ERC20 {
    IERC20 token;

    event BuyTickets(uint256 num_tickets);

    constructor(uint256 initialSupply) ERC20("LTicket", "LTC") {
        token = IERC20(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0); // TODO: hardcode
        _mint(msg.sender, initialSupply);
    }

    receive() external payable {}

    fallback() external {}

    function buyTickets() external payable {
        require(msg.value >= 0.01 ether, "1 ticket is 0.01 eth");
        uint256 num_tickets = msg.value / 0.01 ether;

        _mint(msg.sender, num_tickets);
        emit BuyTickets(num_tickets);

        uint256 change = msg.value - num_tickets * 0.01 ether; // TODO: Лучше просить у юзера присылать нужное количество во фронте
        payable(msg.sender).transfer(change);
    }

    function BuyNumberOfTickets(uint256 amount) external payable {
        require(
            msg.value >= amount * 0.01 ether,
            "Not enough money for this amount of tickets"
        );

        _mint(msg.sender, amount);
        emit BuyTickets(amount);

        uint256 change = msg.value - amount * 0.01 ether; // TODO:  Лучше просить у юзера присылать нужное количество во фронте
        payable(msg.sender).transfer(change);
    }

    /**
     * @notice we trade 1 stable for 1 ticket
     * @dev stables should be approved before calling
     */
    function buyTicketsForStable(uint256 amount) public {
        require(
            amount <= token.allowance(msg.sender, address(this)),
            "Amount exceeds allowance"
        );
        token.transferFrom(msg.sender, address(this), amount);

        _mint(msg.sender, amount);
        emit BuyTickets(amount);
    }
}
