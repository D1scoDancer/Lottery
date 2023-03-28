// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol";

/** @title  ChainlinkRNG
 *  @author Aleksey Shulikov
 *  @notice The Chainlink RNG contract is decomposed from Lottery for a clarity of code.
 *          It has the following responsibilities:
 *          -request random number
 *          -accept callback
 */
abstract contract ChainlinkRNG is Ownable, VRFConsumerBaseV2 {
    /* ============ TYPE DECLARATIONS ============ */

    /// @notice Status of requst, for history lookups
    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
        uint randomWord;
    }

    /* ============ STATE VARIABLES ============ */

    /// @notice Address of LinkToken for funding the contract
    LinkTokenInterface public i_linkToken;

    /// @notice requestId --> requestStatus mapping
    mapping(uint256 => RequestStatus) public s_requests;

    /// @notice Past request Ids
    uint256[] public requestIds;

    /// @notice The last request Id
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

    /* ============ EVENTS ============ */
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    /* ============ INITIALIZATION ============ */

    constructor(
        address vrfCoordinatorV2,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        address link
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
        i_linkToken = LinkTokenInterface(link);
    }

    /**
     *
     * @dev надо добавить модификатор доступа по типу onlyOwner
     * @dev только Lottery can call this
     */
    function requestRandomWord() internal returns (uint256 requestId) {
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

    /**
     *  @notice Get status of specified request
     *  @param _requestId Request ID
     *  @return fulfilled Fulfilled status
     *  @return randomWord Random word
     */
    function getRequestStatus(
        uint256 _requestId
    ) external view returns (bool fulfilled, uint256 randomWord) {
        require(s_requests[_requestId].exists, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.fulfilled, request.randomWord);
    }
}
