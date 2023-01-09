// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

/* Errors */
error Lottery__NotEnoughMoney();

/**@title Web3 Lottery with Aave
 * @author Aleksey Shulikov
 */
contract Lottery is Ownable, VRFConsumerBaseV2 {
    /* Type declarations */
    /* State variables */
    address payable[] private s_players;
    uint private constant FEE = 0.001 ether;

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 1;

    /* Events */ // which params should be indexed?
    event LotteryEntered(address player);
    event LotteryFinished(address winner, uint prize);
    event RequestedRandomWinner(uint256 requestId);

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
        if (msg.value < FEE) {
            // <= ?
            revert Lottery__NotEnoughMoney();
        }
        s_players.push(payable(msg.sender)); // check if already exists
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
        uint256 requestId,
        uint256[] memory randomWords
    ) internal override {}

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

    function getNumPlayers() public view returns (uint) {
        return s_players.length;
    }

    function getFEE() public pure returns (uint) {
        return FEE;
    }
}
