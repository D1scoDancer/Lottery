// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";
import "./Lottery.sol";

contract ChainlinkRNG is Ownable, VRFConsumerBaseV2 {
    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint randomWord;
    }

    Lottery public lottery;

    LinkTokenInterface public LINKTOKEN;

    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

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

    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    constructor(
        address vrfCoordinatorV2,
        bytes32 gasLane,
        // uint64 subscriptionId,
        uint32 callbackGasLimit,
        address link
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        uint64 subscriptionId = i_vrfCoordinator.createSubscription();
        i_vrfCoordinator.addConsumer(subscriptionId, address(this));
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        LINKTOKEN = LinkTokenInterface(link);
    }

    /**
     * @dev надо добавить модификатор доступа по типу onlyOwner
     * @dev только Lottery can call this
     */
    function requestRandomWord() external returns (uint256 requestId) {
        // Will revert if subscription is not set and funded.
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requests[requestId] = RequestStatus({randomWord: 0, exists: true, fulfilled: false});
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId, NUM_WORDS);
        return requestId;
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        require(s_requests[requestId].exists, "request not found");
        s_requests[requestId].fulfilled = true;
        s_requests[requestId].randomWord = randomWords[0];
        emit RequestFulfilled(requestId, randomWords);

        // callback to Lottery
        lottery.rawChainlinkRNGCallBack(randomWords[0]);
    }

    function fund(uint96 amount) public {
        LINKTOKEN.transferAndCall(address(i_vrfCoordinator), amount, abi.encode(i_subscriptionId));
    }

    function setLottery(address lotteryAddress) external onlyOwner {
        lottery = Lottery(lotteryAddress);
    }

    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256 randomWord) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWord);
    }
}
/*
0x2Ca8E0C643bDe4C2E08ab1fA0da3401AdAD7734D
0x79d3d8832d904592c0bf9818b621522c988bb8b0c05cdc3b15aea1b6e8db0c15
8426
50000
*/
