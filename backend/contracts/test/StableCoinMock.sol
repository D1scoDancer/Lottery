// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity 0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract StableCoinMock is ERC20 {
    constructor(uint256 initialSupply) ERC20("Stable", "USDT") {
        _mint(msg.sender, initialSupply);
    }

    function buyStableCoin(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
