const { ethers } = require("hardhat");

const RAY = 10 ** 27; // 10 to the power 27
const SECONDS_PER_YEAR = 31536000;

const getAPY = async () => {
  console.log("calculating future income");
  const deployer = await ethers.getSigner();
  const LendingPool = await ethers.getContractAt(
    "IPool",
    "0xE7EC1B0015eb2ADEedb1B7f9F1Ce82F9DAD6dF08", // copied from Remix
    deployer
  );

  const data = await LendingPool.getReserveData(
    "0xD0dF82dE051244f04BfF3A8bB1f62E1cD39eED92"
  );

  const [
    configuration,
    liquidityIndex,
    currentLiquidityRate,
    variableBorrowIndex,
    currentVariableBorrowRate,
    currentStableBorrowRate,
    lastUpdateTimestamp,
    id,
    aTokenAddress,
    stableDebtTokenAddress,
    variableDebtTokenAddress,
    interestRateStrategyAddress,
    accruedToTreasury,
    unbacked,
    isolationModeTotalDebt,
  ] = data;

  // Deposit and Borrow calculations
  // APY and APR are returned here as decimals, multiply by 100 to get the percents
  depositAPR = currentLiquidityRate / RAY;
  variableBorrowAPR = currentVariableBorrowRate / RAY;
  stableBorrowAPR = currentVariableBorrowRate / RAY;

  depositAPY = (1 + depositAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
  variableBorrowAPY =
    (1 + variableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;
  stableBorrowAPY =
    (1 + stableBorrowAPR / SECONDS_PER_YEAR) ** SECONDS_PER_YEAR - 1;

  console.log(`depositAPY: ${depositAPY * 100}%`);
  return depositAPY;
};

module.exports = { getAPY };
