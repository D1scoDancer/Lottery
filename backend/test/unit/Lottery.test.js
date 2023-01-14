const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains, networkConfig } = require("../../helper-hardhat-config")

!developmentChains.includes(network.name)
    ? describe.skip()
    : describe("Lottery Unit Tests", () => {
          let deployer
          let accounts
          let lottery
          let vrfCoordinatorV2Mock
          const FEE = ethers.utils.parseEther("0.001")
          const DOUBLE_FEE = 2 * FEE

          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              accounts = await ethers.getSigners()
              await deployments.fixture(["all"])
              lottery = await ethers.getContract("Lottery", deployer)
              vrfCoordinatorV2Mock = await ethers.getContract("VRFCoordinatorV2Mock", deployer)
          })

          describe("Constructor", () => {
              it("owner is set", async () => {
                  const owner = await lottery.owner()
                  assert.equal(owner, deployer)
              })

              it("i_vrfCoordinator is set", async () => {}) // TODO:

              it("i_gasLane is set", async () => {
                  const gasLane = networkConfig[31337].gasLane
                  const i_gasLane = await lottery.getGasLane()
                  assert.equal(i_gasLane, gasLane)
              })

              it("i_subscriptionId is set", async () => {
                  const i_subscriptionId = await lottery.getSubscriptionId()
                  assert.equal(i_subscriptionId.toString(), "1")
              })

              it("i_callbackGasLimit is set", async () => {
                  const callbackGasLimit = networkConfig[31337].callbackGasLimit
                  const i_callbackGasLimit = await lottery.getCallbackGasLimit()
                  assert.equal(i_callbackGasLimit, callbackGasLimit)
              })
          })

          describe("Enter Lottery", () => {
              it("can enter with msg.value > FEE", async () => {
                  await expect(lottery.enterLottery({ value: DOUBLE_FEE })).not.to.be.revertedWith(
                      "Lottery__NotEnoughMoney()"
                  )
              })

              it("reverted with custom error when msg.value = FEE", async () => {
                  await expect(lottery.enterLottery({ value: FEE })).to.be.revertedWith(
                      "Lottery__NotEnoughMoney()"
                  )
              })

              it("reverted with custom error when msg.value < FEE", async () => {
                  await expect(lottery.enterLottery({ value: 0 })).to.be.revertedWith(
                      "Lottery__NotEnoughMoney()"
                  )
              })

              it("new address gets pushed to s_players list", async () => {
                  const numPlayersBefore = await lottery.getNumPlayers()
                  await lottery.enterLottery({ value: DOUBLE_FEE })
                  const numPlayersAfter = await lottery.getNumPlayers()
                  assert.equal(numPlayersAfter.toString(), numPlayersBefore.add(1).toString())
              })

              it("address doesn't get pushed to s_players list on second entry", async () => {
                  const numPlayersBefore = await lottery.getNumPlayers()
                  await lottery.enterLottery({ value: DOUBLE_FEE })
                  await lottery.enterLottery({ value: DOUBLE_FEE })
                  const numPlayersAfter = await lottery.getNumPlayers()
                  assert.equal(numPlayersAfter.toString(), numPlayersBefore.add(1).toString())
              })

              it("s_playerToStake[address] increases by msg.value - FEE", async () => {
                  await lottery.enterLottery({ value: DOUBLE_FEE })
                  const stake = await lottery.getStake()
                  assert.equal(stake.toString(), FEE.toString())
              })

              it("s_totalStake increases by msg.value - FEE", async () => {
                  await lottery.enterLottery({ value: DOUBLE_FEE })
                  const totalStake = await lottery.getTotalStake()
                  assert.equal(totalStake.toString(), FEE.toString())
              })

              it("event gets emited with correct address", async () => {
                  await expect(lottery.enterLottery({ value: DOUBLE_FEE }))
                      .to.emit(lottery, "LotteryEntered")
                      .withArgs(deployer)
              })

              it("lottery balance increases by msg.value", async () => {
                  const lotteryBalanceBefore = await lottery.provider.getBalance(lottery.address)
                  await lottery.enterLottery({ value: DOUBLE_FEE })
                  const lotteryBalanceAfter = await lottery.provider.getBalance(lottery.address)
                  assert.equal(
                      lotteryBalanceAfter.toString(),
                      lotteryBalanceBefore.add(DOUBLE_FEE).toString()
                  )
              })
          })

          describe("Finish Lottery", () => {
              beforeEach(async () => {
                  for (let i = 0; i < 10; i++) {
                      const user = accounts[1 + i]
                      const userConnection = await lottery.connect(user)

                      await userConnection.enterLottery({ value: DOUBLE_FEE })
                  }
              })

              it("can call finishLottery() while being an owner", async () => {
                  await expect(lottery.finishLottery([])).not.to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })

              it("cannot call finishLottery() without being an owner", async () => {
                  const user = accounts[1]
                  const userConnection = await lottery.connect(user)

                  await expect(userConnection.finishLottery([])).to.be.revertedWith(
                      "Ownable: caller is not the owner"
                  )
              })

              it("random is different depending on seed", async () => {
                  const tx1Response = await lottery.finishLottery([]) // Account #9
                  const tx1Receipt = await tx1Response.wait(1)
                  const winner1 = tx1Receipt.events[0].args.winner

                  for (let i = 0; i < 10; i++) {
                      const user = accounts[1 + i]
                      const userConnection = await lottery.connect(user)

                      await userConnection.enterLottery({ value: DOUBLE_FEE })
                  }

                  const tx2Response = await lottery.finishLottery([1]) // Account #10
                  const tx2Receipt = await tx2Response.wait(1)
                  const winner2 = tx2Receipt.events[0].args.winner
                  assert.notEqual(winner2, winner1)
              })

              it("LotteryFinished event gets emitted", async () => {
                  await expect(lottery.finishLottery([])).to.emit(lottery, "LotteryFinished")
              })

              it("money is sent to winner", async () => {
                  const winnerBalanceBefore = await lottery.provider.getBalance(accounts[9].address)
                  await lottery.finishLottery([]) // Account #9
                  const winnerBalanceAfter = await lottery.provider.getBalance(accounts[9].address)
                  assert(winnerBalanceAfter.gt(winnerBalanceBefore))
              })

              it("s_players list gets resetted", async () => {
                  await lottery.finishLottery([])

                  const numPlayersAfter = await lottery.getNumPlayers()
                  assert.equal(numPlayersAfter.toString(), "0")
              })

              it("s_playerToStake mapping gets resetted", async () => {
                  await lottery.finishLottery([])

                  for (let i = 0; i < 10; i++) {
                      const user = accounts[1 + i]
                      const userConnection = await lottery.connect(user)

                      const stake = await userConnection.getStake()
                      assert.equal(stake.toString(), "0")
                  }
              })

              it("s_totalStake variable gets resetted", async () => {
                  await lottery.finishLottery([])

                  const s_totalStake = await lottery.getTotalStake()
                  assert.equal(s_totalStake.toString(), "0")
              })
          })

          describe("Get Winner", () => {
              beforeEach(async () => {}) // TODO: initialize lottery state with several players
              it("", async () => {}) //  TODO: prove that random works
          })
      })
