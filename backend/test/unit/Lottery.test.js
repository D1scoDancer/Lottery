const { ethers, network, deployments } = require("hardhat")
const { expect } = require("chai")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

const fee = networkConfig[network.config.chainId]["fee"]
const enterValue = ethers.utils.parseEther("0.1")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("Lottery Unit Testing", () => {
          var lottery, deployer, user, userConnection, vrfCoordinatorV2Mock
          beforeEach(async () => {
              signers = await ethers.getSigners()
              deployer = signers[0]
              user = signers[1]
              await deployments.fixture(["all"])
              lottery = await ethers.getContract("Lottery", deployer)
              userConnection = lottery.connect(user)

              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock")
          })

          describe("Initialization", () => {
              it("Fee is set", async () => {
                  const _fee = await lottery.fee()
                  expect(_fee.toString()).to.equal(fee.toString())
              })
          })

          describe("Enter Lottery", () => {
              it("mapping balances changes", async () => {
                  const balance = await lottery.balances(0, deployer.address)
                  expect(balance.toString()).to.equal("0")

                  await lottery.enterLottery({ value: enterValue })

                  const balanceAfter = await lottery.balances(0, deployer.address)
                  expect(balanceAfter.toString()).to.equal(enterValue.sub(fee).toString())
              })

              it("mapping players changes", async () => {
                  await lottery.enterLottery({ value: enterValue })
                  const address = await lottery.players(0, 0)
                  expect(address).to.equal(deployer.address)
              })

              it("mapping totalStake changes", async () => {
                  const totalStakeBefore = await lottery.totalStake(0)
                  expect(totalStakeBefore.toString()).to.equal("0")

                  await lottery.enterLottery({ value: enterValue })

                  const totalStakeAfter = await lottery.totalStake(0)
                  expect(totalStakeAfter.toString()).to.equal(
                      totalStakeBefore.add(enterValue).sub(fee).toString()
                  )
              })

              it("contract balance changes", async () => {
                  const balanceBefore = await lottery.provider.getBalance(lottery.address)
                  expect(balanceBefore.toString()).to.equal("0")

                  await lottery.enterLottery({ value: enterValue })

                  const balanceAfter = await lottery.provider.getBalance(lottery.address)
                  expect(balanceAfter.toString()).to.equal(balanceBefore.add(enterValue).toString())
              })

              it("fee is not paid if player exists", async () => {
                  await lottery.enterLottery({ value: enterValue })
                  const totalStakeBefore = await lottery.totalStake(0)
                  expect(totalStakeBefore.toString()).to.equal(enterValue.sub(fee).toString())

                  await lottery.enterLottery({ value: enterValue })

                  const totalStakeAfter = await lottery.totalStake(0)
                  expect(totalStakeAfter.toString()).to.equal(
                      totalStakeBefore.add(enterValue).toString()
                  )
              })
          })

          describe("Ownable", () => {
              it("Owner is set", async () => {
                  const owner = await lottery.owner()
                  expect(owner).to.be.equal(deployer.address)
              })

              it("Only owner can togglePause()", async () => {
                  expect(userConnection.togglePause()).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
                  expect(lottery.togglePause()).not.to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })
          })

          describe("Pausable", () => {
              it("Pause is set", async () => {
                  const paused = await lottery.paused()
                  expect(paused).to.be.false
              })

              it("EnterLottery is not accessible when contract is paused", async () => {
                  expect(lottery.enterLottery({ value: enterValue })).not.to.be.revertedWith(
                      "Pausable: paused"
                  )
                  await lottery.togglePause()
                  expect(lottery.enterLottery({ value: enterValue })).to.be.revertedWith(
                      "Pausable: paused"
                  )
              })
          })

          describe("Changing States", () => {
              it("startLottery() changes state to WORKING", async () => {
                  const stateBefore = await lottery.states(0)
                  expect(stateBefore.toString()).to.equal("0")

                  await lottery.startLottery()

                  const stateAfter = await lottery.states(0)
                  expect(stateAfter.toString()).to.equal("1")
              })

              it("finishLottery() changes state to OPEN_FOR_WITHDRAW", async () => {
                  const stateBefore = await lottery.states(0)
                  expect(stateBefore.toString()).to.equal("0")

                  await lottery.startLottery()
                  // await lottery.finishLottery()  // RNG is empty

                  // const stateAfter = await lottery.states(0)
                  // expect(stateAfter.toString()).to.equal("2")
              })
          })

          describe("Withdraw", () => {
              it("User's contract round balance decreases", async () => {
                  await lottery.enterLottery({ value: enterValue })

                  const balanceBefore = await lottery.balances(0, deployer.address)
                  expect(balanceBefore.toString()).to.equal(enterValue.sub(fee).toString())

                  await lottery.startLottery()

                  await new Promise(async (resolve, reject) => {
                      lottery.once("OpenedForWithdraw", async () => {
                          console.log("OpenedForWithdraw event fired!")

                          try {
                              await lottery.withdrawFromRound(0)
                              const balanceAfter = await lottery.balances(0, deployer.address)
                              expect(balanceAfter.toString()).to.equal("0")
                              resolve()
                          } catch (e) {
                              reject(e)
                          }
                      })

                      lottery.on("*", (event) => {
                          console.log("New event:", event.event)
                      })

                      // kicking off the event by mocking the chainlink --keepers-- and vrf coordinator
                      const tx = await lottery.finishLottery()
                      const txReceipt = await tx.wait(1)
                      await vrfCoordinatorV2Mock.fulfillRandomWords(
                          txReceipt.events[1].args.requestId,
                          lottery.address
                      )
                  })
              })

              it("User's ETH account balance increases", async () => {
                  await lottery.enterLottery({ value: enterValue })

                  const balanceBefore = await lottery.provider.getBalance(deployer.address)

                  await lottery.startLottery()
                  await lottery.finishLottery()

                  await lottery.withdrawFromRound(0)

                  const balanceAfter = await lottery.provider.getBalance(deployer.address)
                  expect(balanceAfter.gt(balanceBefore)).to.be.true
              })

              it("Cannot withdraw if balance is 0", async () => {
                  await lottery.startLottery()
                  await lottery.finishLottery()

                  expect(lottery.withdrawFromRound(0)).to.be.revertedWith("Nothing to withdraw")
              })

              it("Cannot withdraw in wrong lottery state", async () => {
                  expect(lottery.withdrawFromRound(0)).to.be.revertedWith("Lottery__StateError()")
              })
          })
      })
