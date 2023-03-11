// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import "./interfaces/IDeposit.sol";
import "@aave/core-v3/contracts/mocks/tokens/MintableERC20.sol"; // delete on dev

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

    /**
     * @notice Receive money from an external call
     */
    receive() external payable {}

    /// @inheritdoc IDeposit
    function deposit(uint256 amount) external override {
        _approveTokens(amount);
        _depositTokens(amount);
        emit Deposited(amount, address(lendingPool));
    }

    /// @inheritdoc IDeposit
    function withdraw(uint256 amount) external override {
        lendingPool.withdraw(address(asset), amount, address(this));
        emit Withdrawn(amount, address(this));
    }

    /* ============ Internal Functions ============ */

    /**
     * @notice Approves ERC-20. Part of deposit(uint amount) function
     * @param amount Amount of money being approved
     */
    function _approveTokens(uint256 amount) internal {
        asset.approve(address(lendingPool), amount); // should wait after that?
    }

    /**
     * @notice Deposits approved tokens. Part of deposit(uint amount) function
     * @param amount Amount of money being deposited
     */
    function _depositTokens(uint256 amount) internal {
        lendingPool.supply(address(asset), amount, address(this), 0);
    }

    /* ============ Getters ============ */
    function getLendingPoolAddress() public view returns (address) {
        return address(lendingPool);
    }

    function getERC20Balance() public view returns (uint256) {
        return asset.balanceOf(address(this));
    }
}
