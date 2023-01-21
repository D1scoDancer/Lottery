// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IPrizeDistributor {
    event Withdrawed();

    function withdraw() external;
}
