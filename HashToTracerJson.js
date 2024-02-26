// 逻辑应该是1.先根据输入的合约地址，获取其交易哈希 2.将交易哈希放进tracer中进行信息搜寻 3.将两个不同tracer产生的数据进行整合 4.整和之后调用convertCSV.js获取该笔交易的数据
const fs = require('fs');
const axios = require('axios');

// const contractTransaction = './hardhatWork/ContractTransactions.json';
// const Transactions = fs.readFileSync(contractTransaction, 'utf-8');
// const parseTransactions = JSON.parse(Transactions);

const fetchContractTransactions = require('./GetContractTransactions')
const alchemyTrace_optracer = require('./tracer/tracer_log')
const alchemyTrace_calltracer = require('./tracer/call_tracer')
const getMultipleInformation = require('./getMultipleInformation')
const processStructLogs = require('./convertCSV')


// console.log(parseTransactions)

let n = 1;
async function main(attackName, contractAddress) {
    try {

        const contractTransaction = await fetchContractTransactions(contractAddress);
        console.log(contractTransaction)
        const Transactions = await fs.promises.readFile(contractTransaction, 'utf-8');
        console.log(Transactions)
        const parseTransactions = JSON.parse(Transactions);
        // console.log(parseTransactions)

        let optracerPath = '';
        let calltracerPath = '';

        for (i = 0; n < 16; i++) {
            try {
                if (parseTransactions[i]) {
                    console.log(parseTransactions[i])
                    const txhash = parseTransactions[i];
                    optracerPath = await alchemyTrace_optracer(attackName, txhash, n);
                    calltracerPath = await alchemyTrace_calltracer(attackName, txhash, n);

                    // console.log("--------------")
                    // console.log(optracerPath)
                    // console.log(calltracerPath)
                    // console.log("--------------")

                    let MultipleInformationPath = await getMultipleInformation(calltracerPath, optracerPath, n);
                    console.log("--------------")
                    console.log(MultipleInformationPath)
                    console.log("--------------")
                    let CSVpath = await processStructLogs(MultipleInformationPath, n);

                    n = n + 1;
                } else {
                    break;
                }
            } catch (error) {
                console.log(error);
                console.log(n);
                // 删除报错文件
                // fs.unlink(optracerPath)
                // fs.unlink(calltracerPath)
                // n = n - 1;
            }
        }
    } catch (error) {
        // 出错i的时候应该不要这样处理，而是跳过当前交易
        console.error(error)
    }

}

main("SushiSwap_attack ", "0x4c4564a1FE775D97297F9e3Dc2e762e0Ed5Dda0e")
wuxizhi = "003"
euler_attack = "0xc310a0affe2169d1f6feec1c63dbc7f7c62a887fa48795d327d4d2da2d6b111d"
uniswap_v2_attack = "0x45d108052e01c20f37fd05db462b9cef6629a70849bcd71b36291786ee6ee3e9"
usdc_transfer_tx = "0x890249a15f17950a60711c0396ccd147068365ea852f0837c08f55f9dd7c320e"
SushiSwap_attack = "0x04b166e7b4ab5105a8e9c85f08f6346de1c66368687215b0e0b58d6e5002bc32"
