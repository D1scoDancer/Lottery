// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";

contract Deposit {
    IERC20 public asset;
    IPool public lendingPool;

    constructor(address _assetAddr, address poolAddressProviderAddr) {
        asset = IERC20(_assetAddr);
        IPoolAddressesProvider poolAddressProvider = IPoolAddressesProvider(
            poolAddressProviderAddr
        );
        lendingPool = IPool(poolAddressProvider.getPool());
    }
}
