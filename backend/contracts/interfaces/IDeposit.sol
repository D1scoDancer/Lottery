// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

/**
 * @title  IDeposit
 * @author Aleksey Shulikov
 * @notice The Deposit Interface
 */
interface IDeposit {
    /**
     * @notice Emit when money were successfully deposited to Aave
     * @param amount Amount of money being deposited
     * @param to     Address of where money go after deposit (Lending pool)
     */
    event Deposited(uint amount, address to);

    /**
     * @notice Emit when money were successfully withdrawn from the pool
     * @param amount Amount of money being withdrawn
     * @param to     Address of where money go after withdrawal (Deposit contract)
     */
    event Withdrawn(uint amount, address to);

    /**
     * @notice Deposit money to lending pool
     * @param amount Amount of money being deposited
     */
    function deposit(uint amount) external;

    /**
     * @notice Withdraw money from the lending pool
     * @param amount Amount of money being withdrawn
     */
    function withdraw(uint amount) external;
}
