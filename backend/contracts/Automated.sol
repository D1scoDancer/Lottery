// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

abstract contract Automated is AutomationCompatibleInterface {
    error Automated__OnlyKeeperRegistry();

    event KeeperRegistryAddressUpdated(address oldAddress, address newAddress);
    event PrintAddress(address indexed addr);

    address private s_keeperRegistryAddress;

    modifier onlyKeeperRegistry() {
        emit PrintAddress(msg.sender);
        if (msg.sender != s_keeperRegistryAddress) {
            revert Automated__OnlyKeeperRegistry();
        }
        _;
    }

    constructor(address keeperRegistryAddress) {
        setKeeperRegistryAddress(keeperRegistryAddress);
    }

    function checkUpkeep(
        bytes calldata
    ) external view virtual returns (bool upkeepNeeded, bytes memory performData);

    /// @dev should have onlyKeeperRegistry
    function performUpkeep(bytes calldata performData) external virtual;

    function setKeeperRegistryAddress(address keeperRegistryAddress) public virtual {
        require(keeperRegistryAddress != address(0));
        emit KeeperRegistryAddressUpdated(s_keeperRegistryAddress, keeperRegistryAddress);
        s_keeperRegistryAddress = keeperRegistryAddress;
    }

    function getKeeperRegistryAddress() external view returns (address keeperRegistryAddress) {
        return s_keeperRegistryAddress;
    }
}
