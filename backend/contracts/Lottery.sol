// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/* Errors */
error Lottery__NotEnoughMoney();

/**@title Web3 Lottery with Aave
 * @author Aleksey Shulikov
 */
contract Lottery is Ownable {
    /* Type declarations */
    /* State variables */
    address payable[] private s_players;
    uint private constant FEE = 0.001 ether;

    /* Events */
    event LotteryEntered(address player);
    event LotteryFinished(address winner, uint prize);

    /* Functions */
    constructor() Ownable() {}

    function enterLottery() external payable {
        if (msg.value < FEE) {
            revert Lottery__NotEnoughMoney();
        }
        s_players.push(payable(msg.sender)); // check if already exists
        emit LotteryEntered(msg.sender);
    }

    /**
     * @dev for testing purposes, should be changed for automatic function that ends lottery on time
     */
    function finishLottery(bytes memory seed) public onlyOwner {
        uint rnd = uint(keccak256((seed)));
        uint winnerIndex = rnd % s_players.length;

        emit LotteryFinished(s_players[winnerIndex], address(this).balance);

        s_players[winnerIndex].transfer(address(this).balance);
        s_players = new address payable[](0);
    }

    /* Getter Functions */
    function getPlayer(uint index) public view returns (address) {
        return s_players[index];
    }

    function getFEE() public pure returns (uint) {
        return FEE;
    }
}
