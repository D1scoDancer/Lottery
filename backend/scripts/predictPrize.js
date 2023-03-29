const { getAPY } = require("../scripts/getAPY.js")

const predictPrize = async (amount) => {
    const apy = await getAPY()

    const prizeSize = amount * apy
    const weekPrize = prizeSize / 12 / 4
    console.log(`Prize Size in year: ${prizeSize}`)
    console.log(`Total money in year: ${amount + prizeSize}`)
    console.log(`Prize Size in week: ${weekPrize}`)
    console.log(`Total money in week: ${amount + weekPrize}`)
}

predictPrize(10000)
