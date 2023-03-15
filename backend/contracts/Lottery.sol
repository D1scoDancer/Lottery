// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/** @title  Web3 Lottery with Aave
 *  @author Aleksey Shulikov
 *  @notice The Lottert contract has the following responsibilities:
 *          -take money from user and remember that
 *          -send that money to AaveDeposit Contract
 *          -choose winner by random from ChainLink VRF (chainlink VRF should be in another lib/contract)
 *          -pick a winner
 *  @dev should be Ownable, Pausable, VRF2ConsumerBaseV2
 */
contract Lottery is Ownable, Pausable {
    /* ============ TYPE DECLARATIONS ============ */
    enum LotteryState {
        OPEN,
        WORKING,
        PAUSED
    }

    /* ============ STATE VARIABLES ============ */

    /// @notice Current state of contract [OPEN | WORKING | PAUSED]
    LotteryState public currentState;

    /// @notice Previous state of contract [OPEN | WORKING | PAUSED]
    LotteryState public previousState;

    /// @notice Current Round
    uint public round;

    /// @notice Round to Player to Stake
    mapping(uint => mapping(address => uint)) public balances;

    /// @notice Round to list of Players
    mapping(uint => address[]) public players;

    /// @notice Round to Total Stake
    mapping(uint => uint) public totalStake;

    /// @notice Fee amount
    uint public fee;

    /* ============ EVENTS ============ */
    event LotteryEntered(address player);

    /* ============ ERRORS ============  */
    error Lottery__NotEnoughMoney();
    error Lottery__TransferFailed();
    error Lottery__Unauthorized();

    /* ============ MODIFIERS ============  */

    /// @dev Для того, чтобы определенные функции могли вызывать исключительно другие контракты проекта
    modifier onlyBy(address account) {
        if (msg.sender != account) revert Lottery__Unauthorized();
        _;
    }

    /* ============ INITIALIZATION ============ */

    constructor(uint _fee) {
        fee = _fee;
    }

    /* ============ EXTERNAL FUNCTIONS ============ */
    function enterLottery() external payable whenNotPaused {
        if (balances[round][msg.sender] > 0) {
            balances[round][msg.sender] += msg.value;
            totalStake[round] += msg.value;
        } else {
            require(msg.value > fee);
            players[round].push(msg.sender);
            balances[round][msg.sender] = msg.value - fee;
            totalStake[round] += msg.value - fee;
        }
        emit LotteryEntered(msg.sender);
    }

    function togglePause() external onlyOwner {
        if (paused()) {
            _unpause();
            setState(previousState);
        } else {
            _pause();
            setState(LotteryState.PAUSED);
        }
    }

    /** @notice Changes state from OPEN to WORKING
     *  @dev Запрещать вывод средств текущего раунда
     *  @dev Отправлять деньги в Контракт 2
     */
    function closeDepositing() public onlyOwner {
        require(currentState == LotteryState.OPEN, "Can only close depositing when state is OPEN");
        setState(LotteryState.WORKING);
    }

    /** @notice Changes state from WORKING TO OPEN
     *  @dev определять победителя
     *  @dev увеличивать его баланс
     *  @dev инкрементировать раунд
     *  @dev работа с Контрактом 3
     */
    function finishLottery() public onlyOwner {
        require(
            currentState == LotteryState.WORKING,
            "Can only finish lottery when state is WORKING"
        );
        setState(LotteryState.OPEN);
    }

    /* ============ INTERNAL FUNCTIONS ============ */

    /**
     * @dev не уверен, что тут нужен модификатор onlyOwner. Возможно нужен другой
     */
    function setState(LotteryState newState) internal onlyOwner {
        require(newState >= LotteryState.OPEN && newState <= LotteryState.PAUSED, "Invalid state");
        previousState = currentState;
        currentState = newState;
    }

    /* ============ GETTERS ============ */
}
