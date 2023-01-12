// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

/* Errors */
error Lottery__NotEnoughMoney();
error Lottery__TransferFailed();

/**@title Web3 Lottery with Aave
 * @author Aleksey Shulikov
 */
contract Lottery is Ownable, VRFConsumerBaseV2 {
    /* Type declarations */
    enum LotteryState {
        // make use of enum or delete
        OPEN,
        CALCULATING
    }

    /* State variables */
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    /* Lottery variables */
    address payable[] private s_players;
    mapping(address => uint256) private s_playerToStake;
    uint256 public s_totalStake;
    uint private constant FEE = 0.001 ether;

    /* Events */
    event LotteryEntered(address indexed player);
    event LotteryFinished(address indexed winner, uint prize);
    event RequestedRandomWinner(uint256 indexed requestId);

    /* Functions */
    constructor(
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) Ownable() VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }

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

    function fulfillRandomWords(
        uint256 /*requestId*/,
        uint256[] memory randomWords
    ) internal override {
        uint256 winnerIndex = randomWords[0] % s_players.length;
        address winner = s_players[winnerIndex];
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
     * @dev for testing purposes, should be changed for automatic function that ends lottery on time
     */
    function finishLottery(bytes memory seed) public onlyOwner {
        uint rnd = uint(keccak256((seed)));
        uint winnerIndex = rnd % s_players.length;
        address winner = s_players[winnerIndex];
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

    /* Getter Functions */
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
}
