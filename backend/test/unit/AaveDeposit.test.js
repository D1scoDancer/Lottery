const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")
const helpers = require("@nomicfoundation/hardhat-network-helpers")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("AaveDeposit Unit Tests", () => {
          let deployer
          let accounts
          let aaveDeposit
          let lendingPoolAddress
          let pool
          let asset
          const chainId = network.config.chainId
          const ERC_AMOUNT = 100 * 1e6
          const AAVE_PRICE = 1e2

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              accounts = await ethers.getSigners()
              await deployments.fixture(["all"])
              aaveDeposit = await ethers.getContract("AaveDeposit", deployer)
              lendingPoolAddress = await aaveDeposit.getLendingPoolAddress()
              pool = await ethers.getContractAt("Pool", lendingPoolAddress)
              asset = await ethers.getContractAt(
                  "TestnetERC20",
                  networkConfig[chainId]["depositAssetAddress"]
              )
              await asset.approve(aaveDeposit.address, ERC_AMOUNT)
              await asset.transfer(aaveDeposit.address, ERC_AMOUNT)
          })

          describe("Debugging", () => {
              it("deployer has 900 tokens after transfer", async () => {
                  const balance = await asset.balanceOf(deployer)
                  assert.equal(balance.toString(), 900e6)
              })

              it("aaveDeposit has 100 tokens after transfer", async () => {
                  const balance = await asset.balanceOf(aaveDeposit.address)
                  assert.equal(balance.toString(), ERC_AMOUNT)
              })

              it("info from getUserAccountData", async () => {
                  let { totalCollateralBase } = await pool.getUserAccountData(aaveDeposit.address)
                  let balance = await asset.balanceOf(aaveDeposit.address)
                  await aaveDeposit.deposit(ERC_AMOUNT)
                  //   await helpers.time.increase(3600 * 24 * 7)
                  await aaveDeposit.withdraw(ERC_AMOUNT)
              })
          })

          describe("Deposit", () => {
              it("AaveDeposit ERC-20 balance decreases", async () => {
                  const balanceBefore = await asset.balanceOf(aaveDeposit.address)
                  await aaveDeposit.deposit(ERC_AMOUNT)
                  const balanceAfter = await asset.balanceOf(aaveDeposit.address)
                  assert.equal(balanceAfter.toString(), balanceBefore.sub(ERC_AMOUNT).toString())
              })

              it("Pool ERC-20 balance increses", async () => {
                  let { totalCollateralBase } = await pool.getUserAccountData(aaveDeposit.address)
                  const balanceBefore = totalCollateralBase
                  await aaveDeposit.deposit(ERC_AMOUNT)
                  ;({ totalCollateralBase } = await pool.getUserAccountData(aaveDeposit.address))
                  const balanceAfter = totalCollateralBase
                  assert.equal(
                      balanceAfter.toString(),
                      balanceBefore.add(ERC_AMOUNT * AAVE_PRICE).toString()
                  )
              })
          })

          describe("Withdraw", () => {
              beforeEach(async () => {
                  await aaveDeposit.deposit(ERC_AMOUNT)
              })

              it("AaveDeposit ERC-20 balance increases", async () => {
                  const balanceBefore = await asset.balanceOf(aaveDeposit.address)
                  await aaveDeposit.withdraw(ERC_AMOUNT)
                  const balanceAfter = await asset.balanceOf(aaveDeposit.address)
                  assert.equal(balanceAfter.toString(), balanceBefore.add(ERC_AMOUNT).toString())
              })

              it("Pool ERC-20 balance decreases", async () => {
                  let { totalCollateralBase } = await pool.getUserAccountData(aaveDeposit.address)
                  const balanceBefore = totalCollateralBase
                  await aaveDeposit.withdraw(ERC_AMOUNT)
                  ;({ totalCollateralBase } = await pool.getUserAccountData(aaveDeposit.address))
                  const balanceAfter = totalCollateralBase
                  assert.equal(
                      balanceAfter.toString(),
                      balanceBefore.sub(ERC_AMOUNT * AAVE_PRICE).toString()
                  )
              })
          })

          describe("Yield is earned with time", () => {})
      })
