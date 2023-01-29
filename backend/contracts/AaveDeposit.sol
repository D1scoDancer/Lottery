// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "./interfaces/IDeposit.sol";

/**
 * @title  Aave Deposit
 * @author Aleksey Shulikov
 * @notice The AaveDeposit contract holds info about lending pool and assets used and is responsible
 *         for depositing and withdrawing money
 */
contract AaveDeposit is IDeposit {
    /* ============ State Variables ============ */

    /// @notice Asset (USDT) address
    IERC20 public asset;

    /// @notice LendingPool address
    IPool public lendingPool;

    /* ============ Initialize  ============ */

    /**
     * @notice Initialize AaveDeposit smart contract
     * @param assetAddr               Asset address
     * @param poolAddressProviderAddr PoolAddressProvider address
     */
    constructor(address assetAddr, address poolAddressProviderAddr) {
        asset = IERC20(assetAddr);
        IPoolAddressesProvider poolAddressProvider = IPoolAddressesProvider(
            poolAddressProviderAddr
        );
        lendingPool = IPool(poolAddressProvider.getPool());
    }

    /* ============ External Functions ============ */

    /// @inheritdoc IDeposit
    function deposit(uint amount) external override {
        _approveTokens(amount);
        _depositTokens(amount);
        emit Deposited(amount, address(lendingPool));
    }

    /// @inheritdoc IDeposit
    function withdraw(uint amount) external override {
        lendingPool.withdraw(address(asset), amount, address(this));
        emit Withdrawn(amount, address(this));
    }

    /* ============ Internal Functions ============ */

    /**
     * @notice Approves ERC-20. Part of deposit(uint amount) function
     * @param amount Amount of money being approved
     */
    function _approveTokens(uint amount) internal {
        asset.approve(address(lendingPool), amount); // should wait after that?
    }

    /**
     * @notice Deposits approved tokens. Part of deposit(uint amount) function
     * @param amount Amount of money being deposited
     */
    function _depositTokens(uint amount) internal {
        lendingPool.supply(address(asset), amount, address(this), 0);
    }
}
