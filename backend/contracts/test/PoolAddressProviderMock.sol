// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@aave/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol";

contract PoolAddressesProviderMock is PoolAddressesProvider {
    constructor(string memory marketId, address owner) PoolAddressesProvider(marketId, owner) {}
}
