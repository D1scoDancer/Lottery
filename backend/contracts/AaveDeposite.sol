// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import {IPool} from "@aave/core-v3/contracts/interfaces/IPool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AaveDeposite {
    // erc20 deposit
    // erc20 return
    IPool public pool;
    IERC20 public asset;

    constructor(address aaveV3PoolAddress, address _asset) {
        pool = IPool(aaveV3PoolAddress);
        asset = IERC20(_asset);
    }

    // should have modifier of who can call it
    function deposit(uint256 amount, address onBehalfOf) public {
        asset.approve(pool.address, amount);
        pool.supply(asset, amount, onBehalfOf, 0);
    }

    function withdraw(uint256 amount, address to) {
        pool.withdraw(asset.address, amount, to);
    }
}
