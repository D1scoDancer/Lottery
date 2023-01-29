// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

/** @title  Web3 Lottery with Aave
 *  @author Aleksey Shulikov
 *  @notice The PrizeDistributor interface.
 */
interface IPrizeDistributor {
    event Withdrawed();

    function withdraw() external;
}
