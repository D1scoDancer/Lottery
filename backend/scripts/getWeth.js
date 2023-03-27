const { ethers } = require("hardhat");

const AMOUNT = ethers.utils.parseEther("0.1");

async function getWeth() {
  console.log("buying Weth...");
  const deployer = await ethers.getSigner();
  const WETH9 = await ethers.getContractAt(
    "IWeth",
    "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92", // WETH-Mock
    deployer
  );

  const txResponse = await WETH9.deposit({
    value: AMOUNT,
  });

  await txResponse.wait(1);
  const wethBalance = await WETH9.balanceOf(deployer.address);
  console.log(`Got ${wethBalance.toString()} WETH`);
}

// getWeth();

module.exports = { getWeth, AMOUNT };
