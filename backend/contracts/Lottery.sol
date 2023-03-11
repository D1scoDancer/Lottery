// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/* ============ ERRORS ============  */
error Lottery_NotEnoughMoney();
error Lottery_TransferFailed();

/** @title  Web3 Lottery with Aave
 *  @author Aleksey Shulikov
 *  @notice The Lottert contract has the following responsibilities:
 *          -take money from user and remember that
 *          -send that money to AaveDeposit Contract
 *          -choose winner by random from ChainLink VRF (chainlink VRF should be in another lib/contract)
 *          -pick a winner
 *  @dev should be Ownable, Pausable, VRF2ConsumerBaseV2
 */
contract Lottery {
    /* ============ TYPE DECLARATIONS ============ */
    enum LotteryState {
        OPEN,
        WORKING,
        PAUSED
    }

    /* ============ STATE VARIABLES ============ */

    /// @notice Round to Player to Stake
    mapping(uint => mapping(address => uint)) public balances;

    /// @notice Round to list of Players
    mapping(uint => address[]) public players;

    /// @notice Round to Total Stake
    mapping(uint => uint) public totalStake;

    /// @notice Fee amount
    uint public fee;

    /* ============ EVENTS ============ */

    /* ============ INITIALIZATION ============ */

    constructor(uint _fee) {
        fee = _fee;
    }

    /* ============ EXTERNAL FUNCTIONS ============ */

    /* ============ INTERNAL FUNCTIONS ============ */

    /* ============ GETTERS ============ */
}
