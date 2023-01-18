require("@nomiclabs/hardhat-waffle")
require("ethereum-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")

const GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || "https://eth-goerli"
const PRIVATE_KEY = process.env.PRIVATE_KEY || "0xkey"
const ETHERSCAN_API = process.env.ETHERSCAN_API || "key"
const COINTMARKETCAP_API = process.env.COINTMARKETCAP_API || "key"
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "key"

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: "0.8.17",
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockConfirmations: 1,
            forking: {
                url: MAINNET_RPC_URL,
                blockNumber: 16425232, // 17.01.23
            },
        },
        goerli: {
            url: `${GOERLI_RPC_URL}`,
            accounts: [`0x${PRIVATE_KEY}`],
            chainId: 5,
            blockConfirmations: 6,
        },
        fantomtest: {
            // url: "https://rpc.testnet.fantom.network",
            url: "https://fantom-testnet.public.blastapi.io	",
            chainId: 4002,
            accounts: [`0x${PRIVATE_KEY}`],
            blockConfirmations: 1,
            live: false,
            saveDeployments: true,
            gasMultiplier: 2,
        },
    },
    localhost: {
        url: "http://127.0.0.1:8545/",
        chainId: 31337,
    },
    etherscan: {
        apiKey: ETHERSCAN_API,
    },
    namedAccounts: {
        deployer: {
            default: 0,
            // 4: 1,
        },
        user: {
            default: 1,
        },
    },
    gasReporter: {
        enabled: false,
        outputFile: "gas-report.txt",
        noColors: true,
        currency: "USD",
        coinmarketcap: COINTMARKETCAP_API,
        // token: "MATIC",
    },
}
