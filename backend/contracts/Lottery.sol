// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

/* Errors */
error Lottery__NotEnoughMoney();
error Lottery__TransferFailed();
error Lottery__AaveDepositSendingFailed();

/** @title  Web3 Lottery with Aave
 *  @author Aleksey Shulikov
 *  @notice The Lottert contract has the following responsibilities:
 *          -take money from user and remember that
 *          -send that money to AaveDeposit Contract
 *          -choose winner by random from ChainLink VRF (chainlink VRF should be in another lib/contract)
 *          -pick a winner (maybe this will be tranfered to another contract)
 */
contract Lottery is Ownable, VRFConsumerBaseV2 {
    /* ============ State Variables ============ */

    /// @notice VRF (Verifiable Random Function) address
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;

    /// @notice The maximum gas price we are willing to pay for a request in wei
    bytes32 private immutable i_gasLane;

    /// @notice The unique identifier of the subscription
    uint64 private immutable i_subscriptionId;

    /// @notice The maximum amount of gas we are willing to spend on the callback request
    uint32 private immutable i_callbackGasLimit;

    /// @notice The number of block confirmations the VRF service will wait to respond
    uint16 private constant REQUEST_CONFIRMATIONS = 3;

    /// @notice The number of random numbers to request
    uint32 private constant NUM_WORDS = 1;

    /// @notice AaveDeposit contract address
    address private aaveDeposite;

    /* ============ Lottery variables ============ */

    /// @notice List of all players
    address payable[] private s_players;

    /// @notice Maps players => their total stake
    mapping(address => uint256) private s_playerToStake;

    /// @notice The total amount of all money staked (excluding fees)
    uint public s_totalStake;

    /// @notice Fee amount
    uint private constant FEE = 0.001 ether;

    /* ============ Events ============ */

    /**
     * @notice Emits when player enters lottery with deposit
     * @param player Address of player
     */
    event LotteryEntered(address indexed player);

    /**
     * @notice Emits when lottery is finished and winner is decided
     * @param winner Address of winner
     * @param prize  Prize amount
     */
    event LotteryFinished(address indexed winner, uint prize);

    /**
     * @notice Emits when Chainlink VRF is requested
     * @param requestId ID of request to Chainlink VRF
     */
    event RequestedRandomWinner(uint256 indexed requestId);

    /* ============ Initialize  ============ */

    /**
     * @notice Initializes Lottery smart contract
     * @param _aaveDeposite    AaveDeposit contract address
     * @param vrfCoordinatorV2 VRFCoordinatorV2 contract address
     * @param gasLane          The maximum gas price we are willing to pay for a request
     * @param subscriptionId   The unique identifier of the subscription
     * @param callbackGasLimit The maximum amount of gas we are willing to spend on the callback request
     */
    constructor(
        address _aaveDeposite,
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) Ownable() VRFConsumerBaseV2(vrfCoordinatorV2) {
        aaveDeposite = _aaveDeposite;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

    /* ============ Functions  ============ */

    /**
     * @notice Participate in the lottery with a deposit that exceeds the fee
     */
    function enterLottery() external payable {
        if (msg.value <= FEE) {
            revert Lottery__NotEnoughMoney();
        }
        if (s_playerToStake[msg.sender] == 0) {
            s_players.push(payable(msg.sender));
        }
        s_playerToStake[msg.sender] += msg.value - FEE;
        s_totalStake += msg.value - FEE;
        emit LotteryEntered(msg.sender);
    }

    /**
     * @notice Create request to Chainlink VRF
     * @dev Should check is it is possible to call the function from any address or only from owner of subscription
     */
    function requestRandomWinner() external {
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );
        emit RequestedRandomWinner(requestId);
    }

    /**
     * @notice Finish lottery and decide a winner.
     * @dev This funciton is the callback VRF function
     * @param requestId ID of request to Chainlink VRF
     * @param randomWords Random words
     */
    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address winner = getWinner(randomWords[0]);
        uint prize = s_totalStake;

        for (uint index = 0; index < s_players.length; index++) {
            s_playerToStake[s_players[index]] = 0;
        }
        s_players = new address payable[](0);
        s_totalStake = 0;

        (bool success, ) = winner.call{value: prize}("");
        if (!success) {
            revert Lottery__TransferFailed();
        }
        emit LotteryFinished(winner, prize);
    }

    /**
     * @dev Exists for testing purposes, should be replaced with automatic function that ends lottery on time
     * @param seed Seed for a custom randomness
     */
    function finishLottery(bytes memory seed) public onlyOwner {
        uint rnd = uint(keccak256(abi.encodePacked(seed))); // it is said to be good practice but it seems to be useless step (encoding)
        address winner = getWinner(rnd);
        uint prize = s_totalStake;

        for (uint index = 0; index < s_players.length; index++) {
            s_playerToStake[s_players[index]] = 0;
        }
        s_players = new address payable[](0);
        s_totalStake = 0;

        (bool success, ) = winner.call{value: prize}("");
        if (!success) {
            revert Lottery__TransferFailed();
        }
        emit LotteryFinished(winner, prize);
    }

    /**
     * @notice Decide a winner
     * @param randomNumber Random number
     */
    function getWinner(uint randomNumber) internal view returns (address winner) {
        uint random = randomNumber % s_totalStake;
        uint sum = 0;
        for (uint i = 0; i < s_players.length; i++) {
            sum += s_playerToStake[s_players[i]];
            if (sum > random) {
                return s_players[i];
            }
        }
    }

    /**
     * @notice Send money to AaveDeposit contract
     * @dev Reentrancy possible!!!???
     */
    function sendToAaveDeposit() public {
        (bool success, ) = aaveDeposite.call{value: s_totalStake}("");
        if (!success) {
            revert Lottery__AaveDepositSendingFailed();
        }
    }

    /* ============ Getters  ============ */

    function getPlayer(uint index) public view returns (address) {
        return s_players[index];
    }

    function getNumPlayers() public view returns (uint) {
        return s_players.length;
    }

    function getFEE() public pure returns (uint) {
        return FEE;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getGasLane() public view returns (bytes32) {
        return i_gasLane;
    }

    function getSubscriptionId() public view returns (uint64) {
        return i_subscriptionId;
    }

    function getCallbackGasLimit() public view returns (uint32) {
        return i_callbackGasLimit;
    }

    function getStake() public view returns (uint) {
        return s_playerToStake[msg.sender];
    }

    function getTotalStake() public view returns (uint) {
        return s_totalStake;
    }
}
