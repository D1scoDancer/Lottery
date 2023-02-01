const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("AaveDeposit Unit Tests", () => {
          let deployer
          let accounts
          let aaveDeposit
          let asset
          const chainId = network.config.chainId
          const ERC_AMOUNT = 100

          beforeEach(async () => {
              // should approve and transfer ERC-20 from deployer
              // then after each reset network
              //    const helpers = require("@nomicfoundation/hardhat-network-helpers");
              //    await helpers.reset(url, blockNumber)
              deployer = (await getNamedAccounts()).deployer
              accounts = await ethers.getSigners()
              await deployments.fixture(["all"])
              aaveDeposit = await ethers.getContract("AaveDeposit", deployer)
              asset = await ethers.getContractAt(
                  "TestnetERC20",
                  networkConfig[chainId]["depositAssetAddress"]
              )
          })

          describe("Constructor", () => {
              it("has 100 tokens", async () => {
                  const balance = await asset.balanceOf(deployer)
                  console.log(balance.toString())
              })
          })

          describe("Deposit", () => {
              it("AaveDeposit ERC-20 balance decreases", async () => {})

              it("Pool ERC-20 balance increses", async () => {})
          })

          describe("Withdraw", () => {
              it("AaveDeposit ERC-20 balance increases", async () => {})

              it("Pool ERC-20 balance decreases", async () => {})
          })

          describe("Yield is earned with time", () => {})
      })
