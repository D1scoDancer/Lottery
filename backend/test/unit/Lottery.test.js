const { assert, expect } = require("chai")
const { deployments, ethers, getNamedAccounts, network } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

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

              it("address gets pushed to s_players list", async () => {
                  const numPlayersBefore = await lottery.getNumPlayers()
                  await lottery.enterLottery({ value: DOUBLE_FEE })
                  const numPlayersAfter = await lottery.getNumPlayers()
                  assert.equal(numPlayersAfter.toString(), numPlayersBefore.add(1).toString())
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
                  const tx1Response = await lottery.finishLottery([]) // Account #3
                  const tx1Receipt = await tx1Response.wait(1)
                  const winner1 = tx1Receipt.events[0].args.winner

                  for (let i = 0; i < 10; i++) {
                      const user = accounts[1 + i]
                      const userConnection = await lottery.connect(user)

                      await userConnection.enterLottery({ value: DOUBLE_FEE })
                  }

                  const tx2Response = await lottery.finishLottery([1]) // Account #7
                  const tx2Receipt = await tx2Response.wait(1)
                  const winner2 = tx2Receipt.events[0].args.winner
                  assert.notEqual(winner2, winner1)
              })

              it("LotteryFinished event gets emitted", async () => {
                  await expect(lottery.finishLottery([])).to.emit(lottery, "LotteryFinished")
              })

              //   it("money is sent to winner", async () => { // change because picking winner changed here
              //       const winnerBalanceBefore = await lottery.provider.getBalance(accounts[3].address)
              //       await lottery.finishLottery([]) // Account #3
              //       const winnerBalanceAfter = await lottery.provider.getBalance(accounts[3].address)
              //       assert(winnerBalanceAfter.gt(winnerBalanceBefore))
              //   })

              it("s_players list gets resetted", async () => {
                  await lottery.finishLottery([])

                  const numPlayersAfter = await lottery.getNumPlayers()
                  assert.equal(numPlayersAfter.toString(), 0)
              })

              //   it("s_playerToStake mapping gets resetted", async () => {
              //       await lottery.finishLottery([])

              //       const numPlayersAfter = await lottery.getNumPlayers()
              //       assert.equal(numPlayersAfter.toString(), 0)
              //   })

              //   it("s_totalStake variable gets resetted", async () => {
              //       await lottery.finishLottery([])

              //       const numPlayersAfter = await lottery.getNumPlayers()
              //       assert.equal(numPlayersAfter.toString(), 0)
              //   })
          })
      })
