// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IDeposit {
    event Deposited(uint amount, address to);

    event Withdrawed(uint amount, address to);

    function deposit(uint amount) external;

    function withdraw(uint amount) external;
}
