export const contractLotteryAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9" // localhost
// "0xA41cD71b91F3689F5d7a77F36d5DBAf3F2cF008C" // Goerli
export const LotteryAbi = [
    {
        inputs: [
            {
                internalType: "address",
                name: "vrfCoordinatorV2",
                type: "address",
            },
            {
                internalType: "bytes32",
                name: "gasLane",
                type: "bytes32",
            },
            {
                internalType: "uint64",
                name: "subscriptionId",
                type: "uint64",
            },
            {
                internalType: "uint32",
                name: "callbackGasLimit",
                type: "uint32",
            },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
    },
    {
        inputs: [],
        name: "Lottery__NotEnoughMoney",
        type: "error",
    },
    {
        inputs: [],
        name: "Lottery__TransferFailed",
        type: "error",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "have",
                type: "address",
            },
            {
                internalType: "address",
                name: "want",
                type: "address",
            },
        ],
        name: "OnlyCoordinatorCanFulfill",
        type: "error",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "player",
                type: "address",
            },
        ],
        name: "LotteryEntered",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "winner",
                type: "address",
            },
            {
                indexed: false,
                internalType: "uint256",
                name: "prize",
                type: "uint256",
            },
        ],
        name: "LotteryFinished",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: "address",
                name: "previousOwner",
                type: "address",
            },
            {
                indexed: true,
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "OwnershipTransferred",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "uint256",
                name: "requestId",
                type: "uint256",
            },
        ],
        name: "RequestedRandomWinner",
        type: "event",
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: false,
                internalType: "address",
                name: "winner",
                type: "address",
            },
        ],
        name: "WinnerPicked",
        type: "event",
    },
    {
        inputs: [],
        name: "enterLottery",
        outputs: [],
        stateMutability: "payable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "bytes",
                name: "seed",
                type: "bytes",
            },
        ],
        name: "finishLottery",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "getFEE",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "pure",
        type: "function",
    },
    {
        inputs: [],
        name: "getNumPlayers",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "index",
                type: "uint256",
            },
        ],
        name: "getPlayer",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "getRecentWinner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [],
        name: "owner",
        outputs: [
            {
                internalType: "address",
                name: "",
                type: "address",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "uint256",
                name: "requestId",
                type: "uint256",
            },
            {
                internalType: "uint256[]",
                name: "randomWords",
                type: "uint256[]",
            },
        ],
        name: "rawFulfillRandomWords",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "renounceOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [],
        name: "requestRandomWinner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
            {
                internalType: "address",
                name: "newOwner",
                type: "address",
            },
        ],
        name: "transferOwnership",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
]
