const ethers = require("ethers");

async function getTransactionsByAddress(address, page = 1, perPage = 10) {
    const provider = new ethers.JsonRpcProvider("https://tame-chaotic-daylight.quiknode.pro/32e033fc75eafaba0a8e4c0044f81e548021e6e8/");
    const heads = await provider.send("qn_getTransactionsByAddress", [
        {
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            page: 1,
            perPage: 10,
            from: -10,
            // toBlock: 'latest'
        },
    ]);

    return heads;
}

// 使用示例
(async () => {
    const transactions = await getTransactionsByAddress("0xd8da6bf26964af9d7eed9e03e53415d37aa96045");
    console.log(transactions);
})();
