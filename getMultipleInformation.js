// 本文件实现了CALL类操作的input、to、from字段的插入
const fs = require('fs');

// 读取 JSON 文件
// const inputFile = './euler_attack_call_tracer.json';
// const inputData = fs.readFileSync(inputFile, 'utf8');
// const tx_opFile = './tracer/euler_attack_tx_op_logs.json';
// const tx_Data = fs.readFileSync(tx_opFile, 'utf8');

// // 解析 JSON
// const parsedData = JSON.parse(inputData);
// const parsedtx_Data = JSON.parse(tx_Data);

const getMultipleInformation = async function (attackName, inputFile, tx_opFile, n) {

    const inputData = await fs.promises.readFile(inputFile, 'utf8');
    const tx_Data = await fs.promises.readFile(tx_opFile, 'utf8');

    // 解析 JSON
    const parsedData = JSON.parse(inputData);
    const parsedtx_Data = JSON.parse(tx_Data);

    // 检查 'calls' 是否是数组
    if (Array.isArray(parsedData.calls)) {
        const calls = parsedData.calls;

        function deepTraversal(node, resultArray) {
            if (node && node.input && node.from && node.to) {
                resultArray.push([node.input, node.from, node.to]);

                if (Array.isArray(node.calls)) {
                    node.calls.forEach((childNode) => {
                        deepTraversal(childNode, resultArray);
                    });
                }
            }
        }

        const traversalResult = [];
        calls.forEach((callNode) => {
            deepTraversal(callNode, traversalResult);
        });

        // console.log(traversalResult);

        // 插入
        if (Array.isArray(parsedtx_Data.structLogs)) {
            const structLogs = parsedtx_Data.structLogs;
            console.log(structLogs)
            for (const log of structLogs) {
                if (log.op == "CALL" || log.op == "STATICCALL" || log.op == "DELEGATECALL" || log.op == "CREATE") {
                    // console.log("============")
                    // console.log(log.op)
                    // console.log("============")
                    // 检查是否有对应顺序的结构体
                    if (traversalResult.length >= 0) {
                        // 取出对应顺序的结构体并插入到 structLogs 中
                        const nodeObject = traversalResult.shift(); // 取出第一个结构体
                        log.input = nodeObject[0]; // 添加到 structLogs 中
                        log.from = nodeObject[1];
                        log.to = nodeObject[2];
                    } else {
                        console.warn("traversalResult 中没有足够的结构体来匹配所有的 CALL、STATICCALL、DELEGATECALL 或 CREATE 节点。");
                        continue; // 中断循环，因为没有足够的结构体可供插入
                    }
                }
            }
        }
        // 输出到JSON文件
        const outputFile = `/home/kenijima/usr/work/LM/MergeOutput/${attackName}_${n}.json`; // 请替换为实际的输出文件路径
        fs.writeFileSync(outputFile, JSON.stringify(parsedtx_Data, null, 2), 'utf8');
        console.log(`结果已写入到 ${outputFile}`);

        return outputFile;

    } else {
        console.error("JSON 文件中的 'calls' 不是一个数组。");
    }
}
module.exports = getMultipleInformation;