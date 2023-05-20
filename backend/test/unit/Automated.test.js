const { ethers, network, deployments } = require("hardhat")
const { expect, assert } = require("chai")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

const fee = networkConfig[network.config.chainId]["fee"]
const enterValue = ethers.utils.parseEther("0.1")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("Automated Unit tests", () => {
          var lottery, deployer, user, userConnection, vrfCoordinatorV2Mock, automationMock
          beforeEach(async () => {
              signers = await ethers.getSigners()
              deployer = signers[0]
              user = signers[1]
              await deployments.fixture(["all"])
              lottery = await ethers.getContract("Lottery", deployer)
              userConnection = lottery.connect(user)

              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
          })

          describe("checkUpkeep", () => {
              it("returns false if wrong timing", async () => {})

              it("returns true if right timing", async () => {})
          })

          describe("performUpkeep", () => {
              it("can only be called by Chainlink", async () => {})

              it("", async () => {})
          })
      })
