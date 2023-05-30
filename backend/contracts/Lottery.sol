// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "./ChainlinkRNG.sol";
import "./AaveDeposit.sol";
import "./Automated.sol";

enum LotteryState {
    OPEN_FOR_DEPOSIT,
    WORKING,
    OPEN_FOR_WITHDRAW
}

/** @title  Web3 Lottery with Aave
 *  @author Aleksey Shulikov
 *  @notice The Lottery contract has the following responsibilities:
 *          -take money from user and remember that
 *          -send that money to AaveDeposit Contract
 *          -choose winner by random from ChainLink VRF (chainlink VRF should be in another lib/contract)
 *          -pick a winner
 *  @dev should implement Keeper or should not? (State Machine)
 */
contract Lottery is Ownable, Pausable, ChainlinkRNG, AaveDeposit, Automated {
    /* ============ TYPE DECLARATIONS ============ */

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
    event LotteryEntered(address indexed player, uint indexed stake);
    event OpenedForWithdraw();
    event TotalPrize(uint indexed withdrawn);
    event FeeChanged(uint indexed feeBefore, uint indexed feeAfter);

    /* ============ ERRORS ============  */
    error Lottery__NotEnoughMoney();
    error Lottery__TransferFailed();
    error Lottery__Unauthorized(address sender);
    error Lottery__StateError(LotteryState _state, LotteryState current);

    /* ============ MODIFIERS ============  */

    /// @dev Для контроля доступности методов в зависимости от фазы лотереи
    modifier atState(uint inRound, LotteryState state) {
        if (inRound > round || state != states[inRound])
            revert Lottery__StateError(state, states[inRound]);
        _;
    }

    /* ============ INITIALIZATION ============ */

    constructor(
        uint _fee,
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        address addressesProvider,
        address assetAddress
    )
        ChainlinkRNG(vrfCoordinatorV2, gasLane, subscriptionId, callbackGasLimit)
        AaveDeposit(addressesProvider, assetAddress)
    {
        fee = _fee;
    }

    receive() external payable {}

    /* ============ EXTERNAL FUNCTIONS ============ */

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
                payable(owner()).transfer(fee);
            }
        }
        emit LotteryEntered(msg.sender, msg.value - fee);
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
     */
    function startLottery() internal atState(round, LotteryState.OPEN_FOR_DEPOSIT) {
        setState(LotteryState.WORKING);
        uint amount = totalStake[round];
        // change MATIC to WMATIC
        asset.deposit{value: amount}();
        // send money to AaveDeposit | call fastSupply()
        fastSupply(amount);
    }

    /**
     *  @notice Changes Lottery State from WORKING to OPEN_FOR_WITHDRAW
     */
    function finishLottery()
        internal
        atState(round, LotteryState.WORKING)
        returns (uint requestId)
    {
        requestId = requestRandomWord();
    }

    /**
     *  @notice Withdraw user's money from a specific round
     */
    function withdrawFromRound(
        uint fromRound
    ) external atState(fromRound, LotteryState.OPEN_FOR_WITHDRAW) {
        require(balances[fromRound][msg.sender] > 0, "Nothing to withdraw");

        uint amount = balances[fromRound][msg.sender];
        delete balances[fromRound][msg.sender];

        payable(msg.sender).transfer(amount); // AAVE???
    }

    /* ============ INTERNAL FUNCTIONS ============ */

    /**
     *  @notice Callback from ChainlinkRNG;
     */
    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords
    ) internal override {
        realFinishLottery(randomWords[0]);
    }

    /**
     *  @notice The last in the sequence of calls created by finishLottery()
     */
    function realFinishLottery(uint randomWord) internal {
        setState(LotteryState.OPEN_FOR_WITHDRAW);

        uint currentRound = round;
        // increment round
        round += 1;

        // determine a winner
        address winner = getWinner(randomWord, currentRound);

        // determine a prize size | call to Aave?
        uint prize = getTotalPrize(currentRound);

        // change his balance
        balances[currentRound][winner] += prize;

        emit OpenedForWithdraw();
    }

    /**
     * @notice Decide a winner
     * @param randomNumber Random number
     * @param _round Current round
     */
    function getWinner(uint randomNumber, uint _round) internal view returns (address winner) {
        uint random = randomNumber % totalStake[_round];
        uint sum = 0;
        for (uint i = 0; i < players[_round].length; i++) {
            sum += balances[_round][players[_round][i]];
            if (sum > random) {
                return players[_round][i];
            }
        }
    }

    function getTotalPrize(uint _round) internal returns (uint) {
        uint withdrawn = withdrawLiquidity();
        asset.withdraw(withdrawn);
        emit TotalPrize(withdrawn);
        return withdrawn - totalStake[_round];
    }

    function setState(LotteryState newState) internal {
        require(
            newState >= LotteryState.OPEN_FOR_DEPOSIT && newState <= LotteryState.OPEN_FOR_WITHDRAW,
            "Invalid state"
        );
        states[round] = newState;
    }

    function checkUpkeep(
        bytes calldata /* checkData */
    ) external pure override returns (bool upkeepNeeded, bytes memory /* performData */) {
        return (true, "");
    }

    function performUpkeep(bytes calldata /* performData */) external override onlyKeeperRegistry {
        LotteryState curState = states[round];
        if (curState == LotteryState.OPEN_FOR_DEPOSIT) {
            startLottery();
        } else if (curState == LotteryState.WORKING) {
            finishLottery();
        }
    }

    function setFee(uint newFee) external onlyOwner {
        uint oldFee = fee;
        fee = newFee;
        emit FeeChanged(oldFee, newFee);
    }
}
