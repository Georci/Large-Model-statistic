// 逻辑应该是1.先根据输入的合约地址，获取其交易哈希 2.将交易哈希放进tracer中进行信息搜寻 3.将两个不同tracer产生的数据进行整合 4.整和之后调用convertCSV.js获取该笔交易的数据
const fs = require('fs');
const axios = require('axios');

// const contractTransaction = './hardhatWork/ContractTransactions.json';
// const Transactions = fs.readFileSync(contractTransaction, 'utf-8');
// const parseTransactions = JSON.parse(Transactions);

const projectData = require('./Project.json')

const { start, fetchContractTransactions } = require('./GetContractTransactions')
const alchemyTrace_optracer = require('./tracer/tracer_log')
const alchemyTrace_calltracer = require('./tracer/call_tracer')
const getMultipleInformation = require('./getMultipleInformation')
const processStructLogs = require('./convertCSV')


// console.log(parseTransactions)

let n = 1;
let ProjectClass;
let contractAddress;
let ProjectName;

async function GetPreData() {
    let i = 0;

    // main(ProjectName, attackName, contractAddress);
    try {
        await start();
        while (projectData.DEX[i]) {
            try {
                let struct = projectData.DEX[i];
                ProjectClass = "DEX";
                ProjectName = struct.name;
                contractAddress = struct.address;
                const contractTransaction = await fetchContractTransactions(ProjectClass, ProjectName, contractAddress);
                console.log(contractTransaction)
                const Transactions = await fs.promises.readFile(contractTransaction, 'utf-8');
                console.log(Transactions)
                const parseTransactions = JSON.parse(Transactions);

                await main(ProjectClass, ProjectName, contractAddress, parseTransactions);
                await main(ProjectClass, ProjectName + "_attack", struct.attackhash, parseTransactions);
                i = i + 1;
            } catch (error) {
                console.log(struct.name);
                console.log(error);
            }
        };
        i = 0;
        while (projectData.Lending[i]) {
            try {
                let struct = projectData.Lending[i];
                ProjectClass = "LENDING";
                ProjectName = struct.name;
                contractAddress = struct.address;
                const contractTransaction = await fetchContractTransactions(ProjectClass, ProjectName, contractAddress);
                console.log(contractTransaction)
                const Transactions = await fs.promises.readFile(contractTransaction, 'utf-8');
                console.log(Transactions)
                const parseTransactions = JSON.parse(Transactions);

                await main(ProjectClass, ProjectName, contractAddress, parseTransactions);
                await main(ProjectClass, ProjectName + "_attack", struct.attackhash, parseTransactions);
            } catch (error) {
                console.log(struct.name);
                console.log(error);
            }
        };
        while (projectData.Bridge[i]) {
            try {
                let struct = projectData.Bridge[i];
                ProjectClass = "BRIDGE";
                ProjectName = struct.name;
                contractAddress = struct.address;
                const contractTransaction = await fetchContractTransactions(ProjectClass, ProjectName, contractAddress);
                console.log(contractTransaction)
                const Transactions = await fs.promises.readFile(contractTransaction, 'utf-8');
                console.log(Transactions)
                const parseTransactions = JSON.parse(Transactions);

                await main(ProjectClass, ProjectName, contractAddress, parseTransactions);
                await main(ProjectClass, ProjectName + "_attack", struct.attackhash, parseTransactions);
            } catch (error) {
                console.log(struct.name);
                console.log(error);
            }
        };
        while (projectData.Yield[i]) {
            try {
                let struct = projectData.Yield[i];
                ProjectClass = "YIELD";
                ProjectName = struct.name;
                contractAddress = struct.address;
                const contractTransaction = await fetchContractTransactions(ProjectClass, ProjectName, contractAddress);
                console.log(contractTransaction)
                const Transactions = await fs.promises.readFile(contractTransaction, 'utf-8');
                console.log(Transactions)
                const parseTransactions = JSON.parse(Transactions);

                await main(ProjectClass, ProjectName, contractAddress, parseTransactions);
                await main(ProjectClass, ProjectName + "_attack", struct.attackhash, parseTransactions);
            } catch (error) {
                console.log(struct.name);
                console.log(error);
            }
        };

    } catch {
        console.log(error);
    }
}

GetPreData()

async function main(ProjectClass, ProjectName, contractAddress, parseTransactions) {

    try {
        if (contractAddress.length == 42) {
            // const contractTransaction = await fetchContractTransactions(ProjectClass, ProjectName, contractAddress);
            // console.log(contractTransaction)
            // const Transactions = await fs.promises.readFile(contractTransaction, 'utf-8');
            // console.log(Transactions)
            // const parseTransactions = JSON.parse(Transactions);
            // console.log(parseTransactions)

            let optracerPath = '';
            let calltracerPath = '';

            for (i = 0; n < 16; i++) {
                try {
                    if (parseTransactions[i]) {
                        console.log(parseTransactions[i])
                        const txhash = parseTransactions[i];
                        optracerPath = await alchemyTrace_optracer(ProjectClass, ProjectName, txhash, n);
                        calltracerPath = await alchemyTrace_calltracer(ProjectClass, ProjectName, txhash, n);

                        // console.log("--------------")
                        // console.log(optracerPath)
                        // console.log(calltracerPath)
                        // console.log("--------------")

                        let MultipleInformationPath = await getMultipleInformation(ProjectClass, ProjectName, calltracerPath, optracerPath, n);
                        console.log("--------------")
                        console.log(MultipleInformationPath)
                        console.log("--------------")
                        let CSVpath = await processStructLogs(ProjectClass, ProjectName, MultipleInformationPath, n);

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
        } else {
            try {
                optracerPath = await alchemyTrace_optracer(ProjectClass, ProjectName, contractAddress, n);
                calltracerPath = await alchemyTrace_calltracer(ProjectClass, ProjectName, contractAddress, n);

                // console.log("--------------")
                // console.log(optracerPath)
                // console.log(calltracerPath)
                // console.log("--------------")

                let MultipleInformationPath = await getMultipleInformation(ProjectClass, ProjectName, calltracerPath, optracerPath, n);
                console.log("--------------")
                console.log(MultipleInformationPath)
                console.log("--------------")
                let CSVpath = await processStructLogs(ProjectClass, ProjectName, MultipleInformationPath, n);

                n = n + 1;

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



euler_attack = "0xc310a0affe2169d1f6feec1c63dbc7f7c62a887fa48795d327d4d2da2d6b111d"
uniswap_v2_attack = "0x45d108052e01c20f37fd05db462b9cef6629a70849bcd71b36291786ee6ee3e9"

SushiSwap_attack = "0x04b166e7b4ab5105a8e9c85f08f6346de1c66368687215b0e0b58d6e5002bc32"
