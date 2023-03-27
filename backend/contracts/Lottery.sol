// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./ChainlinkRNG.sol";
import "./AaveETHDeposit.sol";

/** @title  Web3 Lottery with Aave
 *  @author Aleksey Shulikov
 *  @notice The Lottery contract has the following responsibilities:
 *          -take money from user and remember that
 *          -send that money to AaveDeposit Contract
 *          -choose winner by random from ChainLink VRF (chainlink VRF should be in another lib/contract)
 *          -pick a winner
 *  @dev should implement Keeper or should not? (State Machine)
 */
contract Lottery is Ownable, Pausable, ChainlinkRNG, AaveETHDeposit {
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
    event OpenedForWithdraw();

    /* ============ ERRORS ============  */
    error Lottery__NotEnoughMoney();
    error Lottery__TransferFailed();
    error Lottery__Unauthorized(address sender);
    error Lottery__StateError();

    /* ============ MODIFIERS ============  */

    /// @dev Для того, чтобы определенные функции могли вызывать исключительно другие контракты проекта
    modifier onlyBy(address account) {
        if (msg.sender != account) revert Lottery__Unauthorized(msg.sender);
        _;
    }

    /// @dev Для контроля доступности методов в зависимости от фазы лотереи
    modifier atState(uint inRound, LotteryState state) {
        if (inRound > round || state != states[inRound]) revert Lottery__StateError();
        _;
    }

    /* ============ INITIALIZATION ============ */

    constructor(
        uint _fee,
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        address link,
        address addressesProvider,
        address assetAddress
    )
        ChainlinkRNG(vrfCoordinatorV2, gasLane, subscriptionId, callbackGasLimit, link)
        AaveETHDeposit(addressesProvider, assetAddress)
    {
        fee = _fee;
    }

    /* ============ EXTERNAL FUNCTIONS ============ */

    /// @dev проверить gas-consumption если сделать переменную round memory здесь
    /// @dev написать тесты на проверку перевода денег к `owner`
    function enterLottery()
        external
        payable
        whenNotPaused
        atState(round, LotteryState.OPEN_FOR_DEPOSIT)
    {
        require(msg.value > 0);
        if (balances[round][msg.sender] > 0) {
            balances[round][msg.sender] += msg.value;
            totalStake[round] += msg.value;
        } else {
            require(msg.value > fee);
            players[round].push(msg.sender);
            balances[round][msg.sender] = msg.value - fee;
            totalStake[round] += msg.value - fee;
            if (fee > 0) {
                payable(owner()).transfer(fee); // not tested yet
            }
        }
        emit LotteryEntered(msg.sender);
    }

    /**
     *  @notice Pauses or resumes the normal flow of the contract
     */
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
     *  @dev метод должен вызываться Keeper-ом
     */
    function startLottery() public onlyOwner atState(round, LotteryState.OPEN_FOR_DEPOSIT) {
        setState(LotteryState.WORKING);

        // send money to AaveDeposit
    }

    /**
     *  @notice Changes Lottery State from WORKING to OPEN_FOR_WITHDRAW
     *  @dev не факт что нужен onlyOwner, скорее всего нужен другой модификатор
     *  @dev метод должен вызываться Keeper-ом
     */
    function finishLottery()
        public
        onlyOwner
        atState(round, LotteryState.WORKING)
        returns (uint requestId)
    {
        requestId = requestRandomWord();
    }

    /**
     *  @notice Withdraw user's money from a specific round
     *  @dev деньги на самом деле должны браться из AaveDeposit.sol
     */
    function withdrawFromRound(
        uint fromRound
    ) external atState(fromRound, LotteryState.OPEN_FOR_WITHDRAW) {
        require(balances[fromRound][msg.sender] > 0, "Nothing to withdraw");

        uint amount = balances[fromRound][msg.sender];
        delete balances[fromRound][msg.sender];

        payable(msg.sender).transfer(amount); // AAVE!!!
    }

    /* ============ INTERNAL FUNCTIONS ============ */

    /**
     *  @notice Callback from ChainlinkRNG;
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(s_requests[requestId].exists, "request not found");
        s_requests[requestId].fulfilled = true;
        s_requests[requestId].randomWord = randomWords[0];
        emit RequestFulfilled(requestId, randomWords);

        emit OpenedForWithdraw();
        realFinishLottery(randomWords[0]);
    }

    /**
     *  @notice The last in the sequence of calls created by finishLottery()
     */
    function realFinishLottery(uint randomWord) internal {
        // determine a winner
        address winner = getWinner(randomWord);

        // determine a prize size | call to Aave?
        uint prize = getTotalPrize(round);

        // change his balance
        balances[round][winner] += prize;

        // increment round
        round += 1;
        // P.S. money is still in the Aave

        setState(LotteryState.OPEN_FOR_WITHDRAW);
        emit OpenedForWithdraw();
    }

    /**
     * @notice Decide a winner
     * @param randomNumber Random number
     * @dev
     */
    function getWinner(uint randomNumber) internal view returns (address winner) {
        uint random = randomNumber % totalStake[round];
        uint sum = 0;
        for (uint i = 0; i < players[round].length; i++) {
            sum += balances[round][players[round][i]];
            if (sum > random) {
                return players[round][i];
            }
        }
    }

    /**
     * @dev should call Aave | but we kinda should know what will be the prize at the beginning of the lottery
     */
    function getTotalPrize(uint _round) internal view returns (uint) {
        return 1 wei;
    }

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
