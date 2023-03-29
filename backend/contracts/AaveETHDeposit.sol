// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import {IPoolAddressesProvider} from "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
// import {IERC20} from "@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {WETH9} from "@aave/core-v3/contracts/dependencies/weth/WETH9.sol";

contract AaveETHDeposit {
    IPoolAddressesProvider internal immutable ADDRESSES_PROVIDER;
    IPool public immutable POOL;

    address internal immutable assetAddress; // WETH
    WETH9 internal immutable asset;

    constructor(address _addressesProvider, address _assetAddress) {
        ADDRESSES_PROVIDER = IPoolAddressesProvider(_addressesProvider);
        POOL = IPool(ADDRESSES_PROVIDER.getPool());
        assetAddress = _assetAddress;
        asset = WETH9(payable(assetAddress));
    }

    /// @dev только одна функция должна остаться
    function fastSupply(uint _amount) public {
        approveWETH(_amount);
        supplyLiquidity(_amount);
    }

    function supplyLiquidity(uint _amount) public {
        POOL.supply(assetAddress, _amount, address(this), 0);
    }

    function withdrawLiquidity() public returns (uint) {
        return POOL.withdraw(assetAddress, type(uint).max, address(this));
    }

    /**
     * @notice Returns the user account data across all the reserves
     * @param _user The address of the user
     * @return totalCollateralBase The total collateral of the user in the base currency used by the price feed
     * @return totalDebtBase The total debt of the user in the base currency used by the price feed
     * @return availableBorrowsBase The borrowing power left of the user in the base currency used by the price feed
     * @return currentLiquidationThreshold The liquidation threshold of the user
     * @return ltv The loan to value of The user
     * @return healthFactor The current health factor of the user
     */
    function getUserAccountData(
        address _user
    )
        external
        view
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        return POOL.getUserAccountData(_user);
    }

    /* ========== EXTRA ========== */
    function approveWETH(uint256 _amount) public returns (bool) {
        return asset.approve(address(POOL), _amount);
    }

    function allowanceWETH() external view returns (uint256) {
        return asset.allowance(address(this), address(POOL));
    }

    function getBalance() external view returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function withdraw() external {
        asset.transfer(msg.sender, asset.balanceOf(address(this)));
    }

    receive() external payable {}
}
