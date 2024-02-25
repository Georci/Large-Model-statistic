// 这段代码的作用是获取给定地址的历史交易哈希
const Moralis = require('moralis').default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const fs = require('fs');

const contractAddress = "0xF9a001d5B2c7c5e45693B41FCF931B94e680cAC4";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjU1NzIxZDRhLTM2NTgtNGNmNS04MDYyLWNlNTAwODI0MDZjNiIsIm9yZ0lkIjoiMzc3ODYyIiwidXNlcklkIjoiMzg4MzA3IiwidHlwZUlkIjoiODg0ZDNjNTctMGQ3Ni00YzIyLWI2ZDQtMDFjNWEyNzExM2E1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDgzMjI2ODgsImV4cCI6NDg2NDA4MjY4OH0.YPj-3eeTjGk-c2geiAuC1RuMB2dmjzXe65wFQ1668tQ"; // 请替换为您的实际 API 密钥
const chain = EvmChain.ETHEREUM;

async function fetchContractTransactions(contractAddress) {
    try {
        await Moralis.start({
            apiKey: apikey
        });

        const response = await Moralis.EvmApi.transaction.getWalletTransactions({
            "chain": chain,
            "address": contractAddress,
            "order": 'DESC'
            // "limit":1000
        });

        // console.log(typeof (response));
        // console.log(response.raw)

        let transactionlist = [];

        response.result.forEach(transaction => {
            console.log(transaction.hash);
            transactionlist.push(transaction.hash);
        });

        let outputPath = "/home/kenijima/usr/work/LM/ContractTransactions.json";
        fs.promises.writeFile(outputPath, JSON.stringify(transactionlist, null, 2), 'utf8');
        console.log(`结果已写入到 ${outputPath}`);

        // outputPath = "/home/kenijima/usr/work/LM/ContractTransactions"
        // console.log(outputPath)
        return outputPath;

    } catch (error) {
        console.error(error);
    }
}
module.exports = fetchContractTransactions;

// fetchContractTransactions("0xF9a001d5B2c7c5e45693B41FCF931B94e680cAC4");
