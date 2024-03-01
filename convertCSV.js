// 本文件实现了数据处理
// const fetchData = require('./getFuncName.js');
const fetchData = require('./getFuncName.js');

const fs = require('fs');

async function processStructLogs(ProjectClass, ProjectName, inputFilePath, pc) {
    // 读取 JSON 文件
    // const inputFilePath = './output.json'; //输入文件
    let outputFilePath = '';
    if (ProjectName.slice(-6) == "attack") {
        outputFilePath = `/root/WXZ/Large-Model-statistic/${ProjectClass}/output/attack/${ProjectName}_${pc}.csv`; // 输出文件
        // outputFilePath = `/home/kenijima/usr/work/LM/${ProjectClass}/output/attack/${ProjectName}_${pc}.csv`;
    } else {
        outputFilePath = `/root/WXZ/Large-Model-statistic/${ProjectClass}/output/total/${ProjectName}_${pc}.csv`;
        // outputFilePath = `/home/kenijima/usr/work/LM/${ProjectClass}/output/total/${ProjectName}_${pc}.csv`;
    }


    // inputFilePath = './output_1.json'
    console.log("当前的输入文件：", inputFilePath)
    const txData = await fs.promises.readFile(inputFilePath, 'utf8');

    // 解析 JSON
    const parsedData = JSON.parse(txData);

    // flag作为标志，用来记录最新的CALL调用操作的操作地址，方便知道RETURN操作返回的地址
    let flag = {
        from: "",
        to: "",
        depth: ""
    };
    let lastinfo = {
        pc: "",
        op: "",
        gas: "",
        gasCost: "",
        depth: "",
        stack: "",
        memory: "",
        input: "",
        from: "",
        to: "",
        laststate: "",
        funcArgCount: ""
    };
    let newFlag = {
        to: ""
    };

    let n = 0;// SSTORE、SLOAD的执行计数器
    let callArray = []; // 用于记录所有的call类以及CREATE操作

    if (Array.isArray(parsedData.structLogs)) {
        const structLogs = parsedData.structLogs;
        let csvContent = "Type1, Node1, Type2, Node2, Edgetype, X1, X2\n"; // CSV 文件的标题
        for (let i = 0; i < structLogs.length; i++) {
            let log = structLogs[i];
            if (log.op == "CALL" || log.op == "STATICCALL" || log.op == "DELEGATECALL" || log.op == "CREATE" || log.op == "RETURN" || log.op == "SLOAD" || log.op == "SSTORE" || log.op == "LOG0" || log.op == "LOG1" || log.op == "LOG2" || log.op == "LOG3" || log.op == "LOG4") {
                // newFlag.to = "";
                if (log.op == "CALL" || log.op == "STATICCALL" || log.op == "DELEGATECALL" || log.op == "CREATE" || log.op == "SLOAD" || log.op == "SSTORE" || log.op == "LOG0" || log.op == "LOG1" || log.op == "LOG2" || log.op == "LOG3" || log.op == "LOG4") {
                    if (log.op == "CALL" || log.op == "STATICCALL" || log.op == "DELEGATECALL" || log.op == "CREATE") {
                        // 在本次写数据之前，先处理上一层未完成的数据
                        if (lastinfo.op == "SLOAD" || lastinfo.op == "SSTORE") { csvContent += `addr, ${log.to}, inner, ${lastinfo.laststate}, ${log.depth}\n`; }
                        if (lastinfo.op == "LOG0" || lastinfo.op == "LOG1" || lastinfo.op == "LOG2" || lastinfo.op == "LOG3" || lastinfo.op == "LOG4") { csvContent += `addr, ${log.to}, inner, ${lastinfo.op}, ${log.depth}\n`; }
                        if (lastinfo.op == "CALL" || lastinfo.op == "STATICCALL" || lastinfo.op == "DELEGATECALL") { csvContent += `addr, ${log.from}, innerFuncToCall, ${lastinfo.funcArgCount}, ${log.depth}\n`; }

                        // 本次数据的处理
                        csvContent += `addr, ${log.from}, addr, ${log.to}, ${log.op}, ${log.depth}, ${log.depth + 1}\n`; // Appending data to CSV content
                        // csvContent += `addr, ${log.from}, addr, ${log.to}, ${log.op}, ${log.depth - 1}, ${log.depth}\n`; 
                        // 让flag记录最新的CALL
                        newFlag = { ...flag }; // 创建一个新的flag对象
                        newFlag.from = log.from;
                        newFlag.to = log.to;
                        newFlag.depth = log.depth;

                        callArray.push(newFlag);
                        // console.log("当前的call:", callArray)
                    }
                    // 获取addr --> func,
                    if (log.op == "CALL" || log.op == "STATICCALL" || log.op == "DELEGATECALL" || log.op == "SLOAD" || log.op == "SSTORE" || log.op == "LOG0" || log.op == "LOG1" || log.op == "LOG2" || log.op == "LOG3" || log.op == "LOG4") {
                        //获取func_selector,由于0x占两位所以获取前十个字符
                        if (log.op == "CALL" || log.op == "STATICCALL" || log.op == "DELEGATECALL") {
                            const func_selector = log.input.substring(0, 10);
                            console.log("传入之前的哈希值：", func_selector);
                            let funcName = await fetchData(func_selector);

                            // 处理参数个数
                            let ArgCount; // 参数个数
                            let commaCount; //逗号个数
                            let i; // "("所在的位置 
                            if (funcName) {
                                commaCount = funcName.split(',').length - 1;
                                let str = funcName.split('');
                                for (i = 0; i < str.length; i++) { if (str[i] == "(") { break; } }

                                if (commaCount != 0) { ArgCount = commaCount + 1 } else {
                                    if (str[i + 1] == ")" || str[i + 1] == " ") { ArgCount = 0; } else {
                                        ArgCount = 1;
                                    }
                                } // 0个逗号没有参数，一个逗号两个参数
                            } else { ArgCount = "N" }

                            lastinfo.funcArgCount = ArgCount;
                            csvContent += `addr, ${log.to}, func, ${funcName}, inner, ${log.depth}, ${ArgCount}\n`;
                            // csvContent += funcName;
                            csvContent += `func, ${funcName}, `;

                        }
                        if (log.op == "SLOAD" || log.op == "SSTORE") {
                            let state_opdata;
                            if (log.op == "SLOAD") {
                                const Stack = structLogs[i + 1].stack;
                                state_opdata = Stack[Stack.length - 1];
                            }
                            else {
                                state_opdata = log.stack[log.stack.length - 2];
                            }
                            if (lastinfo.op == "CALL" || lastinfo.op == "STATICCALL" || lastinfo.op == "DELEGATECALL") { csvContent += `operate, ${log.op}, inner, ${lastinfo.funcArgCount}, ${state_opdata}\n`; }
                            else if (lastinfo.op == "SLOAD" || lastinfo.op == "SSTORE") { csvContent += `operate, ${log.op}, inner, ${lastinfo.laststate}, ${state_opdata}\n`; n++ }
                            else if (lastinfo.op == "LOG0" || lastinfo.op == "LOG1" || lastinfo.op == "LOG2" || lastinfo.op == "LOG3" || lastinfo.op == "LOG4") { csvContent += `operate, ${log.op}, inner, ${lastinfo.op}, ${state_opdata}\n`; }
                            csvContent += `operate, ${log.op}, `;
                            lastinfo.laststate = state_opdata;
                        }
                        if (log.op == "LOG0" || log.op == "LOG1" || log.op == "LOG2" || log.op == "LOG3" || log.op == "LOG4") {
                            let topic;
                            if (log.op == "LOG0") { topic = "" }
                            else { topic = log.stack[log.stack.length - 3] }
                            if (lastinfo.op == "CALL" || lastinfo.op == "STATICCALL" || lastinfo.op == "DELEGATECALL") { csvContent += `event, log, inner, ${lastinfo.funcArgCount}, ${log.op}\n`; }
                            else if (lastinfo.op == "SLOAD" || lastinfo.op == "SSTORE") { csvContent += `event, log, inner, ${lastinfo.laststate}, ${log.op}\n`; }
                            else if (lastinfo.op == "LOG0" || lastinfo.op == "LOG1" || lastinfo.op == "LOG2" || lastinfo.op == "LOG3" || lastinfo.op == "LOG4") { csvContent += `event, log, inner, ${lastinfo.op}, ${log.op}\n`; }
                            csvContent += `event, ${log.op}, `;
                        }
                    }
                }
                if (log.op == "RETURN") {
                    if (lastinfo.op == "SLOAD" || lastinfo.op == "SSTORE") { csvContent += `addr, ${newFlag.to}, innerOperateToReturn, ${lastinfo.laststate}, ${newFlag.depth}\n`; }
                    if (lastinfo.op == "LOG0" || lastinfo.op == "LOG1" || lastinfo.op == "LOG2" || lastinfo.op == "LOG3" || lastinfo.op == "LOG4") { csvContent += `addr, ${newFlag.to}, innerEventToReturn, ${lastinfo.op}, ${newFlag.depth}\n`; }
                    if (lastinfo.op == "CALL" || lastinfo.op == "STATICCALL" || lastinfo.op == "DELEGATECALL") { csvContent += `addr, ${newFlag.to}, innerFuncToReturn, ${lastinfo.funcArgCount}, ${log.depth - 1}\n`; }

                    let latestCall;
                    if (callArray != 0) { latestCall = callArray.shift(); } else { break; }
                    csvContent += `addr, ${latestCall.to}, addr, ${latestCall.from}, RETURN, ${log.depth}, ${log.depth - 1}\n`;

                }
                // 记录上一个里面的操作
                lastinfo.pc = log.pc;
                lastinfo.op = log.op;
                lastinfo.gas = log.gas;
                lastinfo.gasCost = log.gasCost;
                lastinfo.depth = log.depth;
                lastinfo.stack = log.stack;
                lastinfo.memory = log.memory;
                lastinfo.input = log.input;
                lastinfo.from = log.from;
                lastinfo.to = log.to;
            }
        }
        // 输出到 CSV 文件
        await fs.promises.writeFile(outputFilePath, csvContent); // 将 CSV 内容写入文件
        console.log('CSV 文件创建成功。');

        return outputFilePath;
    } else {
        console.log('无效的 JSON 数据格式。');
    }
}

module.exports = processStructLogs;

// processStructLogs("/home/kenijima/usr/work/LM/output_1.json", 1)
// 目前存在的疑问：func --》 addr 要不要
// 590行RETURN的三个数据还有问题
// 函数参数，函数名称