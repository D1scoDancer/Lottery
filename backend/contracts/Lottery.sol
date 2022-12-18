// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";

/* Errors */

/**@title Web3 Lottery with Aave
 * @author Aleksey Shulikov
 */
contract Lottery is Ownable {
    /* Type declarations */
    /* State variables */
    address payable[] private s_players;
    mapping(address => uint) private s_playersToAmount;
    uint private constant FEE = 0.001 ether;

    /* Events */

    /* Functions */
    constructor() Ownable() {}

    function enterLottery() external payable {}

    function finishLottery() public {}

    /* Getter Functions */
}
