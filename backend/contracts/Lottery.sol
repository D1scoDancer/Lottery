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
 *  @dev should be Ownable, Pausable
 *  @dev should implement Keeper or should not? (State Machine)
 */
contract Lottery is Ownable, Pausable {
    /* ============ TYPE DECLARATIONS ============ */
    enum LotteryState {
        OPEN_FOR_DEPOSIT,
        WORKING,
        OPEN_FOR_WITHDRAW
    }

    /* ============ STATE VARIABLES ============ */

    /// @notice Current Round
    uint public round;

    /// @notice Round to State
    mapping(uint => LotteryState) public states;

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
    error Lottery__StateError();

    /* ============ MODIFIERS ============  */

    /// @dev Для того, чтобы определенные функции могли вызывать исключительно другие контракты проекта
    modifier onlyBy(address account) {
        if (msg.sender != account) revert Lottery__Unauthorized();
        _;
    }

    modifier atState(uint inRound, LotteryState state) {
        if (inRound > round || state != states[inRound]) revert Lottery__StateError();
        _;
    }

    /* ============ INITIALIZATION ============ */

    constructor(uint _fee) {
        fee = _fee;
    }

    /* ============ EXTERNAL FUNCTIONS ============ */

    // @dev проверить gas-consumption если сделать переменную round memory здесь
    function enterLottery()
        external
        payable
        whenNotPaused
        atState(round, LotteryState.OPEN_FOR_DEPOSIT)
    {
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
        } else {
            _pause();
        }
    }

    /**
     *  @notice Changes Lottery State from OPEN_FOR_DEPOSIT to WORKING
     *  @dev не факт что нужен onlyOwner, скорее всего нужен другой модификатор
     */
    function startLottery() public onlyOwner atState(round, LotteryState.OPEN_FOR_DEPOSIT) {
        setState(LotteryState.WORKING);

        // send money to AaveDeposit
    }

    /**
     *  @notice Changes Lottery State from WORKING to OPEN_FOR_WITHDRAW
     *  @dev не факт что нужен onlyOwner, скорее всего нужен другой модификатор
     */
    function finishLottery() public onlyOwner atState(round, LotteryState.WORKING) {
        setState(LotteryState.OPEN_FOR_WITHDRAW);

        // send request to ChainlinkRNG, get a random number

        // determine a winner

        // determine a prize size

        // change his balance

        // increment round

        // P.S. money is still in the Aave
    }

    /// @notice Withdraw user's money from a specific round
    function withdrawFromRound(
        uint fromRound
    ) external atState(fromRound, LotteryState.OPEN_FOR_WITHDRAW) {
        require(balances[fromRound][msg.sender] > 0, "Nothing to withdraw");

        uint amount = balances[fromRound][msg.sender];
        delete balances[fromRound][msg.sender];

        payable(msg.sender).transfer(amount);
    }

    /* ============ INTERNAL FUNCTIONS ============ */

    /**
     * @dev не уверен, что тут нужен модификатор onlyOwner. Возможно нужен другой
     * @dev возоможно следует заменить на nextState() { inc() }. Так контракт вызовет больше доверия, т.к у owner меньше власти
     */
    function setState(LotteryState newState) internal onlyOwner {
        require(
            newState >= LotteryState.OPEN_FOR_DEPOSIT && newState <= LotteryState.OPEN_FOR_WITHDRAW,
            "Invalid state"
        );
        states[round] = newState;
    }

    /* ============ GETTERS ============ */
}
