const { getWeth } = require("../scripts/getWeth.js");

async function main() {
  await getWeth();

  console.log("deploying...");
  const AaveETHDeposit = await ethers.getContractFactory("AaveETHDeposit");
  const aaveETHDeposit = await AaveETHDeposit.deploy(
    "0x0496275d34753A48320CA58103d5220d394FF77F", // addressprovider
    "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92" // WETH
  );

  await aaveETHDeposit.deployed();

  console.log(
    "MarketInteractions loan contract deployed: ",
    aaveETHDeposit.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
