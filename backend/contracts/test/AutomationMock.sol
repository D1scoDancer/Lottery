// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "../Lottery.sol";

contract AutomationMock {
    Lottery private lottery;

    function perform() external {
        lottery.performUpkeep("");
    }

    function getLottery() external view returns (address) {
        return address(lottery);
    }

    function setLottery(address payable newLotteryAddr) external {
        lottery = Lottery(newLotteryAddr);
    }
}
