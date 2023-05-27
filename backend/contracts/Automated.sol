// SPDX-License-Identifier: MIT
pragma solidity 0.8.10;

import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";

abstract contract Automated is AutomationCompatibleInterface {
    error Automated__OnlyKeeperRegistry(address registry, address caller);

    event KeeperRegistryAddressUpdated(address oldAddress, address newAddress);

    address private s_keeperRegistryAddress;

    modifier onlyKeeperRegistry() {
        if (s_keeperRegistryAddress == address(0)) {
            emit KeeperRegistryAddressUpdated(s_keeperRegistryAddress, msg.sender);
            s_keeperRegistryAddress = msg.sender;
        } else if (msg.sender != s_keeperRegistryAddress) {
            revert Automated__OnlyKeeperRegistry(s_keeperRegistryAddress, msg.sender);
        }
        _;
    }

    function checkUpkeep(
        bytes calldata
    ) external view virtual returns (bool upkeepNeeded, bytes memory performData);

    function performUpkeep(bytes calldata performData) external virtual;

    function setKeeperRegistryAddress(address keeperRegistryAddress) external virtual {
        require(keeperRegistryAddress != address(0));
        emit KeeperRegistryAddressUpdated(s_keeperRegistryAddress, keeperRegistryAddress);
        s_keeperRegistryAddress = keeperRegistryAddress;
    }

    function getKeeperRegistryAddress() external view returns (address keeperRegistryAddress) {
        return s_keeperRegistryAddress;
    }
}
