export const CONTRACT_ABI = [
    // 1. 读方法
    {
        "inputs": [],
        "name": "MAX_SUPPLY",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "MINT_PRICE",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }],
        "name": "balanceOf",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function"
    },
    // 2. 写方法
    {
        "inputs": [
            { "internalType": "uint256", "name": "quantity", "type": "uint256" },
            { "internalType": "bytes32[]", "name": "proof", "type": "bytes32[]" }
        ],
        "name": "whitelistMint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "quantity", "type": "uint256" }],
        "name": "publicMint",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
] as const; // 👈 这里的 as const 非常重要，为了让 Wagmi 获得类型提示