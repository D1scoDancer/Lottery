https://github.com/D1scoDancer/Lottery/commit/5e022d11508124dd7a3f93cae09bfd4eccff53d7

Compilation warnings/errors on ../contracts/AaveETHDeposit.sol:
Warning: SPDX license identifier not provided in source file. Before publishing, consider adding a comment containing "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED" for non-open-source code. Please see https://spdx.org for more information.
--> @aave/core-v3/contracts/dependencies/weth/WETH9.sol


Compilation warnings/errors on ../contracts/Lottery.sol:
Warning: SPDX license identifier not provided in source file. Before publishing, consider adding a comment containing "SPDX-License-Identifier: <SPDX-License>" to each source file. Use "SPDX-License-Identifier: UNLICENSED" for non-open-source code. Please see https://spdx.org for more information.
--> @aave/core-v3/contracts/dependencies/weth/WETH9.sol



AaveETHDeposit.constructor(address,address)._assetAddress (../contracts/AaveETHDeposit.sol#15) lacks a zero-check on :
                - assetAddress = _assetAddress (../contracts/AaveETHDeposit.sol#18)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation

Different versions of Solidity are used:
        - Version used: ['0.8.10', '^0.8.0', '^0.8.10']
        - ^0.8.10 (../contracts/AaveETHDeposit.sol#2)
        - 0.8.10 (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#16)
        - ^0.8.0 (@aave/core-v3/contracts/interfaces/IPool.sol#2)
        - ^0.8.0 (@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol#2)
        - ^0.8.0 (@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol#2)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

AaveETHDeposit.approveWETH(uint256) (../contracts/AaveETHDeposit.sol#36-38) is never used and should be removed
AaveETHDeposit.fastSupply(uint256) (../contracts/AaveETHDeposit.sol#22-25) is never used and should be removed
AaveETHDeposit.withdrawLiquidity() (../contracts/AaveETHDeposit.sol#31-33) is never used and should be removed
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code

Pragma version^0.8.10 (../contracts/AaveETHDeposit.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version0.8.10 (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#16) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version^0.8.0 (@aave/core-v3/contracts/interfaces/IPool.sol#2) allows old versions
Pragma version^0.8.0 (@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol#2) allows old versions
Pragma version^0.8.0 (@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol#2) allows old versions
solc-0.8.10 is not recommended for deployment
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity

Parameter AaveETHDeposit.fastSupply(uint256)._amount (../contracts/AaveETHDeposit.sol#22) is not in mixedCase
Parameter AaveETHDeposit.supplyLiquidity(uint256)._amount (../contracts/AaveETHDeposit.sol#27) is not in mixedCase
Parameter AaveETHDeposit.approveWETH(uint256)._amount (../contracts/AaveETHDeposit.sol#36) is not in mixedCase
Variable AaveETHDeposit.ADDRESSES_PROVIDER (../contracts/AaveETHDeposit.sol#9) is not in mixedCase
Variable AaveETHDeposit.POOL (../contracts/AaveETHDeposit.sol#10) is not in mixedCase
Function IPool.ADDRESSES_PROVIDER() (@aave/core-v3/contracts/interfaces/IPool.sol#630) is not in mixedCase
Function IPool.MAX_STABLE_RATE_BORROW_SIZE_PERCENT() (@aave/core-v3/contracts/interfaces/IPool.sol#693) is not in mixedCase
Function IPool.FLASHLOAN_PREMIUM_TOTAL() (@aave/core-v3/contracts/interfaces/IPool.sol#699) is not in mixedCase
Function IPool.BRIDGE_PROTOCOL_FEE() (@aave/core-v3/contracts/interfaces/IPool.sol#705) is not in mixedCase
Function IPool.FLASHLOAN_PREMIUM_TO_PROTOCOL() (@aave/core-v3/contracts/interfaces/IPool.sol#711) is not in mixedCase
Function IPool.MAX_NUMBER_RESERVES() (@aave/core-v3/contracts/interfaces/IPool.sol#717) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions

Reentrancy in WETH9.withdraw(uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#40-45):
        External calls:
        - address(msg.sender).transfer(wad) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#43)
        Event emitted after the call(s):
        - Withdrawal(msg.sender,wad) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#44)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-4

Variable AaveETHDeposit.ADDRESSES_PROVIDER (../contracts/AaveETHDeposit.sol#9) is too similar to AaveETHDeposit.constructor(address,address)._addressesProvider (../contracts/AaveETHDeposit.sol#15)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#variable-names-are-too-similar

WETH9.decimals (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#21) should be constant
WETH9.name (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#19) should be constant
WETH9.symbol (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#20) should be constant
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#state-variables-that-could-be-declared-constant

withdraw(uint256) should be declared external:
        - WETH9.withdraw(uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#40-45)
totalSupply() should be declared external:
        - WETH9.totalSupply() (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#47-49)
approve(address,uint256) should be declared external:
        - WETH9.approve(address,uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#51-55)
transfer(address,uint256) should be declared external:
        - WETH9.transfer(address,uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#57-59)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-external

Lottery.startLottery() (../contracts/Lottery.sol#130-137) sends eth to arbitrary user
        Dangerous calls:
        - asset.deposit{value: amount}() (../contracts/Lottery.sol#134)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#functions-that-send-ether-to-arbitrary-destinations

Reentrancy in Lottery.realFinishLottery(uint256) (../contracts/Lottery.sol#181-196):
        External calls:
        - prize = getTotalPrize(round) (../contracts/Lottery.sol#186)
                - POOL.withdraw(assetAddress,type()(uint256).max,address(this)) (../contracts/AaveETHDeposit.sol#32)
                - asset.withdraw(withdrawn) (../contracts/Lottery.sol#219)
        State variables written after the call(s):
        - balances[round][winner] += prize (../contracts/Lottery.sol#189)
        - round += 1 (../contracts/Lottery.sol#195)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-1

Lottery.constructor(uint256,address,bytes32,uint64,uint32,address,address).assetAddress (../contracts/Lottery.sol#77) shadows:
        - AaveETHDeposit.assetAddress (../contracts/AaveETHDeposit.sol#12) (state variable)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#local-variable-shadowing

Lottery.setFee(uint256) (../contracts/Lottery.sol#248-250) should emit an event for: 
        - fee = newFee (../contracts/Lottery.sol#249) 
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-events-arithmetic

AaveETHDeposit.constructor(address,address)._assetAddress (../contracts/AaveETHDeposit.sol#15) lacks a zero-check on :
                - assetAddress = _assetAddress (../contracts/AaveETHDeposit.sol#18)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#missing-zero-address-validation

Reentrancy in Lottery.realFinishLottery(uint256) (../contracts/Lottery.sol#181-196):
        External calls:
        - prize = getTotalPrize(round) (../contracts/Lottery.sol#186)
                - POOL.withdraw(assetAddress,type()(uint256).max,address(this)) (../contracts/AaveETHDeposit.sol#32)
                - asset.withdraw(withdrawn) (../contracts/Lottery.sol#219)
        State variables written after the call(s):
        - setState(LotteryState.OPEN_FOR_WITHDRAW) (../contracts/Lottery.sol#191)
                - states[round] = newState (../contracts/Lottery.sol#229)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-2

Reentrancy in Lottery.getTotalPrize(uint256) (../contracts/Lottery.sol#217-222):
        External calls:
        - withdrawn = withdrawLiquidity() (../contracts/Lottery.sol#218)
                - POOL.withdraw(assetAddress,type()(uint256).max,address(this)) (../contracts/AaveETHDeposit.sol#32)
        - asset.withdraw(withdrawn) (../contracts/Lottery.sol#219)
        Event emitted after the call(s):
        - TotalPrize(withdrawn) (../contracts/Lottery.sol#220)
Reentrancy in Lottery.realFinishLottery(uint256) (../contracts/Lottery.sol#181-196):
        External calls:
        - prize = getTotalPrize(round) (../contracts/Lottery.sol#186)
                - POOL.withdraw(assetAddress,type()(uint256).max,address(this)) (../contracts/AaveETHDeposit.sol#32)
                - asset.withdraw(withdrawn) (../contracts/Lottery.sol#219)
        Event emitted after the call(s):
        - OpenedForWithdraw() (../contracts/Lottery.sol#192)
Reentrancy in ChainlinkRNG.requestRandomWord() (../contracts/ChainlinkRNG.sol#55-67):
        External calls:
        - requestId = i_vrfCoordinator.requestRandomWords(i_gasLane,i_subscriptionId,REQUEST_CONFIRMATIONS,i_callbackGasLimit,NUM_WORDS) (../contracts/ChainlinkRNG.sol#57-63)
        Event emitted after the call(s):
        - RequestSent(requestId,NUM_WORDS) (../contracts/ChainlinkRNG.sol#65)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3

Different versions of Solidity are used:
        - Version used: ['0.8.10', '^0.8.0', '^0.8.10', '^0.8.4']
        - ^0.8.10 (../contracts/AaveETHDeposit.sol#2)
        - ^0.8.10 (../contracts/Automated.sol#2)
        - ^0.8.10 (../contracts/ChainlinkRNG.sol#2)
        - ^0.8.10 (../contracts/Lottery.sol#2)
        - 0.8.10 (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#16)
        - ^0.8.0 (@aave/core-v3/contracts/interfaces/IPool.sol#2)
        - ^0.8.0 (@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol#2)
        - ^0.8.0 (@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol#2)
        - ^0.8.4 (@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol#2)
        - ^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol#2)
        - ^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol#2)
        - ^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol#2)
        - ^0.8.0 (@openzeppelin/contracts/access/Ownable.sol#4)
        - ^0.8.0 (@openzeppelin/contracts/security/Pausable.sol#4)
        - ^0.8.0 (@openzeppelin/contracts/utils/Context.sol#4)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

Context._msgData() (@openzeppelin/contracts/utils/Context.sol#21-23) is never used and should be removed
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code

Pragma version^0.8.10 (../contracts/AaveETHDeposit.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version^0.8.10 (../contracts/Automated.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version^0.8.10 (../contracts/ChainlinkRNG.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version^0.8.10 (../contracts/Lottery.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version0.8.10 (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#16) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version^0.8.0 (@aave/core-v3/contracts/interfaces/IPool.sol#2) allows old versions
Pragma version^0.8.0 (@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol#2) allows old versions
Pragma version^0.8.0 (@aave/core-v3/contracts/protocol/libraries/types/DataTypes.sol#2) allows old versions
Pragma version^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol#2) allows old versions
Pragma version^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol#2) allows old versions
Pragma version^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol#2) allows old versions
Pragma version^0.8.0 (@openzeppelin/contracts/access/Ownable.sol#4) allows old versions
Pragma version^0.8.0 (@openzeppelin/contracts/security/Pausable.sol#4) allows old versions
Pragma version^0.8.0 (@openzeppelin/contracts/utils/Context.sol#4) allows old versions
solc-0.8.10 is not recommended for deployment
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity

Parameter AaveETHDeposit.fastSupply(uint256)._amount (../contracts/AaveETHDeposit.sol#22) is not in mixedCase
Parameter AaveETHDeposit.supplyLiquidity(uint256)._amount (../contracts/AaveETHDeposit.sol#27) is not in mixedCase
Parameter AaveETHDeposit.approveWETH(uint256)._amount (../contracts/AaveETHDeposit.sol#36) is not in mixedCase
Variable AaveETHDeposit.ADDRESSES_PROVIDER (../contracts/AaveETHDeposit.sol#9) is not in mixedCase
Variable AaveETHDeposit.POOL (../contracts/AaveETHDeposit.sol#10) is not in mixedCase
Variable Automated.s_keeperRegistryAddress (../contracts/Automated.sol#11) is not in mixedCase
Variable ChainlinkRNG.i_vrfCoordinator (../contracts/ChainlinkRNG.sol#20) is not in mixedCase
Variable ChainlinkRNG.i_gasLane (../contracts/ChainlinkRNG.sol#23) is not in mixedCase
Variable ChainlinkRNG.i_subscriptionId (../contracts/ChainlinkRNG.sol#26) is not in mixedCase
Variable ChainlinkRNG.i_callbackGasLimit (../contracts/ChainlinkRNG.sol#29) is not in mixedCase
Parameter Lottery.getTotalPrize(uint256)._round (../contracts/Lottery.sol#217) is not in mixedCase
Function IPool.ADDRESSES_PROVIDER() (@aave/core-v3/contracts/interfaces/IPool.sol#630) is not in mixedCase
Function IPool.MAX_STABLE_RATE_BORROW_SIZE_PERCENT() (@aave/core-v3/contracts/interfaces/IPool.sol#693) is not in mixedCase
Function IPool.FLASHLOAN_PREMIUM_TOTAL() (@aave/core-v3/contracts/interfaces/IPool.sol#699) is not in mixedCase
Function IPool.BRIDGE_PROTOCOL_FEE() (@aave/core-v3/contracts/interfaces/IPool.sol#705) is not in mixedCase
Function IPool.FLASHLOAN_PREMIUM_TO_PROTOCOL() (@aave/core-v3/contracts/interfaces/IPool.sol#711) is not in mixedCase
Function IPool.MAX_NUMBER_RESERVES() (@aave/core-v3/contracts/interfaces/IPool.sol#717) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions

Reentrancy in Lottery.enterLottery() (../contracts/Lottery.sol#92-112):
        External calls:
        - address(owner()).transfer(fee) (../contracts/Lottery.sol#108)
        Event emitted after the call(s):
        - LotteryEntered(msg.sender,msg.value - fee) (../contracts/Lottery.sol#111)
Reentrancy in WETH9.withdraw(uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#40-45):
        External calls:
        - address(msg.sender).transfer(wad) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#43)
        Event emitted after the call(s):
        - Withdrawal(msg.sender,wad) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#44)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-4

Variable AaveETHDeposit.ADDRESSES_PROVIDER (../contracts/AaveETHDeposit.sol#9) is too similar to AaveETHDeposit.constructor(address,address)._addressesProvider (../contracts/AaveETHDeposit.sol#15)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#variable-names-are-too-similar

WETH9.decimals (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#21) should be constant
WETH9.name (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#19) should be constant
WETH9.symbol (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#20) should be constant
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#state-variables-that-could-be-declared-constant

setKeeperRegistryAddress(address) should be declared external:
        - Automated.setKeeperRegistryAddress(address) (../contracts/Automated.sol#29-33)
withdraw(uint256) should be declared external:
        - WETH9.withdraw(uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#40-45)
totalSupply() should be declared external:
        - WETH9.totalSupply() (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#47-49)
approve(address,uint256) should be declared external:
        - WETH9.approve(address,uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#51-55)
transfer(address,uint256) should be declared external:
        - WETH9.transfer(address,uint256) (@aave/core-v3/contracts/dependencies/weth/WETH9.sol#57-59)
renounceOwnership() should be declared external:
        - Ownable.renounceOwnership() (@openzeppelin/contracts/access/Ownable.sol#61-63)
transferOwnership(address) should be declared external:
        - Ownable.transferOwnership(address) (@openzeppelin/contracts/access/Ownable.sol#69-72)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-external

Different versions of Solidity are used:
        - Version used: ['^0.8.0', '^0.8.10']
        - ^0.8.10 (../contracts/Automated.sol#2)
        - ^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol#2)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

Pragma version^0.8.10 (../contracts/Automated.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol#2) allows old versions
solc-0.8.10 is not recommended for deployment
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity

Variable Automated.s_keeperRegistryAddress (../contracts/Automated.sol#11) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions

Automated (../contracts/Automated.sol#6-38) does not implement functions:
        - Automated.checkUpkeep(bytes) (../contracts/Automated.sol#22-24)
        - Automated.performUpkeep(bytes) (../contracts/Automated.sol#27)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#unimplemented-functions

setKeeperRegistryAddress(address) should be declared external:
        - Automated.setKeeperRegistryAddress(address) (../contracts/Automated.sol#29-33)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-external

Reentrancy in ChainlinkRNG.requestRandomWord() (../contracts/ChainlinkRNG.sol#55-67):
        External calls:
        - requestId = i_vrfCoordinator.requestRandomWords(i_gasLane,i_subscriptionId,REQUEST_CONFIRMATIONS,i_callbackGasLimit,NUM_WORDS) (../contracts/ChainlinkRNG.sol#57-63)
        Event emitted after the call(s):
        - RequestSent(requestId,NUM_WORDS) (../contracts/ChainlinkRNG.sol#65)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#reentrancy-vulnerabilities-3

Different versions of Solidity are used:
        - Version used: ['^0.8.0', '^0.8.10', '^0.8.4']
        - ^0.8.10 (../contracts/ChainlinkRNG.sol#2)
        - ^0.8.4 (@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol#2)
        - ^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol#2)
        - ^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol#2)
        - ^0.8.0 (@openzeppelin/contracts/access/Ownable.sol#4)
        - ^0.8.0 (@openzeppelin/contracts/utils/Context.sol#4)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#different-pragma-directives-are-used

ChainlinkRNG.requestRandomWord() (../contracts/ChainlinkRNG.sol#55-67) is never used and should be removed
Context._msgData() (@openzeppelin/contracts/utils/Context.sol#21-23) is never used and should be removed
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#dead-code

Pragma version^0.8.10 (../contracts/ChainlinkRNG.sol#2) necessitates a version too recent to be trusted. Consider deploying with 0.6.12/0.7.6/0.8.7
Pragma version^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/LinkTokenInterface.sol#2) allows old versions
Pragma version^0.8.0 (@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol#2) allows old versions
Pragma version^0.8.0 (@openzeppelin/contracts/access/Ownable.sol#4) allows old versions
Pragma version^0.8.0 (@openzeppelin/contracts/utils/Context.sol#4) allows old versions
solc-0.8.10 is not recommended for deployment
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#incorrect-versions-of-solidity

Variable ChainlinkRNG.i_vrfCoordinator (../contracts/ChainlinkRNG.sol#20) is not in mixedCase
Variable ChainlinkRNG.i_gasLane (../contracts/ChainlinkRNG.sol#23) is not in mixedCase
Variable ChainlinkRNG.i_subscriptionId (../contracts/ChainlinkRNG.sol#26) is not in mixedCase
Variable ChainlinkRNG.i_callbackGasLimit (../contracts/ChainlinkRNG.sol#29) is not in mixedCase
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#conformance-to-solidity-naming-conventions

ChainlinkRNG (../contracts/ChainlinkRNG.sol#16-68) does not implement functions:
        - VRFConsumerBaseV2.fulfillRandomWords(uint256,uint256[]) (@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol#122)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#unimplemented-functions

renounceOwnership() should be declared external:
        - Ownable.renounceOwnership() (@openzeppelin/contracts/access/Ownable.sol#61-63)
transferOwnership(address) should be declared external:
        - Ownable.transferOwnership(address) (@openzeppelin/contracts/access/Ownable.sol#69-72)
Reference: https://github.com/crytic/slither/wiki/Detector-Documentation#public-function-that-could-be-declared-external
../contracts/ analyzed (28 contracts with 78 detectors), 111 result(s) found