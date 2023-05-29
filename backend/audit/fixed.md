```diff
- Important
Status: solved
```

AaveETHDeposit.constructor(address,address).\_assetAddress (../contracts/AaveETHDeposit.sol#15) lacks a zero-check on : - assetAddress = \_assetAddress (../contracts/AaveETHDeposit.sol#18)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation

```diff
- Important
Status: solved
```

Different versions of Solidity are used: - Version used: ['0.8.10', '^0.8.0', '^0.8.10'] - ^0.8.10 (../contracts/AaveETHDeposit.sol#2) - 0.8.10 (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#16) - ^0.8.0 (@aave/core-v3/contracts/interfaces/IPool.sol#2) - ^0.8.0 (@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol#2) - ^0.8.0 (@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol#2)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

```diff
- Important
Status: solved
```

Lottery.setFee(uint256) (../contracts/Lottery.sol#248-250) should emit an event for: - fee = newFee (../contracts/Lottery.sol#249)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-events-arithmetic

```diff
- Important
Status: solved
```

AaveETHDeposit.constructor(address,address).\_assetAddress (../contracts/AaveETHDeposit.sol#15) lacks a zero-check on : - assetAddress = \_assetAddress (../contracts/AaveETHDeposit.sol#18)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation

```diff
- Important
Status: solved
```

Reentrancy in Lottery.realFinishLottery(uint256) (../contracts/Lottery.sol#181-196):
External calls: - prize = getTotalPrize(round) (../contracts/Lottery.sol#186) - POOL.withdraw(assetAddress,type()(uint256).max,address(this)) (../contracts/AaveETHDeposit.sol#32) - asset.withdraw(withdrawn) (../contracts/Lottery.sol#219)
State variables written after the call(s): - setState(LotteryState.OPEN_FOR_WITHDRAW) (../contracts/Lottery.sol#191) - states[round] = newState (../contracts/Lottery.sol#229)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-2

```diff
- Important
Status: solved
```

setKeeperRegistryAddress(address) should be declared external: - Automated.setKeeperRegistryAddress(address) (../contracts/Automated.sol#29-33)
withdraw(uint256) should be declared external: - WETH9.withdraw(uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#40-45)
totalSupply() should be declared external: - WETH9.totalSupply() (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#47-49)
approve(address,uint256) should be declared external: - WETH9.approve(address,uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#51-55)
transfer(address,uint256) should be declared external: - WETH9.transfer(address,uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#57-59)
renounceOwnership() should be declared external: - Ownable.renounceOwnership() (@openzeppelin/contracts/access/Ownable.sol#61-63)
transferOwnership(address) should be declared external: - Ownable.transferOwnership(address) (@openzeppelin/contracts/access/Ownable.sol#69-72)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-external

```diff
- Important
Status: solved
```

setKeeperRegistryAddress(address) should be declared external: - Automated.setKeeperRegistryAddress(address) (../contracts/Automated.sol#29-33)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-external
