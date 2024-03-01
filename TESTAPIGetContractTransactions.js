// 这段代码的作用是获取给定地址的历史交易哈希
const Moralis = require('moralis').default;
const { EvmChain } = require("@moralisweb3/common-evm-utils");
const fs = require('fs');
const fetch = require("node-fetch");

const contractAddress = "0xF9a001d5B2c7c5e45693B41FCF931B94e680cAC4";
const apikey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6IjU1NzIxZDRhLTM2NTgtNGNmNS04MDYyLWNlNTAwODI0MDZjNiIsIm9yZ0lkIjoiMzc3ODYyIiwidXNlcklkIjoiMzg4MzA3IiwidHlwZUlkIjoiODg0ZDNjNTctMGQ3Ni00YzIyLWI2ZDQtMDFjNWEyNzExM2E1IiwidHlwZSI6IlBST0pFQ1QiLCJpYXQiOjE3MDgzMjI2ODgsImV4cCI6NDg2NDA4MjY4OH0.YPj-3eeTjGk-c2geiAuC1RuMB2dmjzXe65wFQ1668tQ"; // 请替换为您的实际 API 密钥
const chain = EvmChain.ETHEREUM;


// async function fetchContractTransactions(ProjectClass, attackName, contractAddress) {
//     try {
//         var myHeaders = new fetch.Headers();
//         myHeaders.append("Content-Type", "application/json");

//         var raw = JSON.stringify({
//             "id": 67,
//             "jsonrpc": "2.0",
//             "method": "qn_getTransactionsByAddress",
//             "params": [{
//                 "address": "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
//                 "page": 1,
//                 "perPage": 10
//             }]
//         });

//         var requestOptions = {
//             method: 'POST',
//             headers: myHeaders,
//             body: raw,
//             redirect: 'follow'
//         };

//         const response = await fetch("https://tame-chaotic-daylight.quiknode.pro/32e033fc75eafaba0a8e4c0044f81e548021e6e8/", requestOptions)
//         const result = await response.json();
//         console.log(result)


//         // let transactionlist = [];

//         // response.result.forEach(transaction => {
//         //     console.log(transaction.hash);
//         //     transactionlist.push(transaction.hash);
//         // });

//         // // let outputPath = `/root/WXZ/Large-Model-statistic/${ProjectClass}/${attackName}_ContractTransactions.json`;
//         // let outputPath = `/home/kenijima/usr/work/LM/${ProjectClass}/${attackName}_ContractTransactions.json`;
//         // fs.promises.writeFile(outputPath, JSON.stringify(transactionlist, null, 2), 'utf8');
//         // console.log(`结果已写入到 ${outputPath}`);

//         // // outputPath = "/home/kenijima/usr/work/LM/ContractTransactions"
//         // // console.log(outputPath)
//         // return outputPath;

//     } catch (error) {
//         console.error(error);
//     }
// }
// // module.exports = { start, fetchContractTransactions };
// module.exports = fetchContractTransactions;

// fetchContractTransactions("0xF9a001d5B2c7c5e45693B41FCF931B94e680cAC4");

// fetchContractTransactions("DEX", "MonoX Finance", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
async function fetchContractTransactions(ProjectClass, attackName, contractAddress) {
    try {
        var myHeaders = new fetch.Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "id": 67,
            "jsonrpc": "2.0",
            "method": "qn_getTransactionsByAddress",
            "params": [{
                "address": contractAddress,
                "page": 1,
                "perPage": 100,
                "order": "DESC"
            }]
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        const response = await fetch("https://tame-chaotic-daylight.quiknode.pro/32e033fc75eafaba0a8e4c0044f81e548021e6e8/", requestOptions);
        const data = await response.json(); // Convert response to JSON

        const transactionHashes = data.result.paginatedItems.map(item => item.transactionHash);

        console.log(transactionHashes);

        // let outputPath = `/root/WXZ/Large-Model-statistic/${ProjectClass}/${attackName}_ContractTransactions.json`;
        let outputPath = `/home/kenijima/usr/work/LM/${ProjectClass}/${attackName}_ContractTransactions.json`;
        fs.promises.writeFile(outputPath, JSON.stringify(transactionHashes, null, 2), 'utf8');
        console.log(`结果已写入到 ${outputPath}`);
        // fs.writeFileSync('result.json', JSON.stringify(transactionHashes, null, 2)); // Write result to file
        // console.log("Result written to result.json file successfully!");

        return outputPath;
    } catch (error) {
        console.log('error', error);
    }
}

module.exports = fetchContractTransactions;

