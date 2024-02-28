const axios = require('axios'); //alchemy
const https = require('https');
const { time } = require('console');
const fs = require('fs');

const agent = new https.Agent({
  rejectUnauthorized: false, // 如果你的 HTTPS 请求需要验证 SSL 证书，可以将此选项设置为 true
  keepAlive: true
});

const config = {
  timeout: 10000, // 设置超时时间为 5 秒
  httpsAgent: agent // 使用自定义的 httpsAgent
};

euler_attack = "0xc310a0affe2169d1f6feec1c63dbc7f7c62a887fa48795d327d4d2da2d6b111d"
uniswap_v2_attack = "0x45d108052e01c20f37fd05db462b9cef6629a70849bcd71b36291786ee6ee3e9"
usdc_transfer_tx = "0x890249a15f17950a60711c0396ccd147068365ea852f0837c08f55f9dd7c320e"
OlympusDAO_tx = "0x3ed75df83d907412af874b7998d911fdf990704da87c2b1a8cf95ca5d21504cf"
test_tx = "0xf91e64c45c1b2d454b3fc90ea229856720137f40e5dc91315ed8e232ee525ede"
Templedao_tx = "0x8c3f442fc6d640a6ff3ea0b12be64f1d4609ea94edd2966f42c01cd9bdcf04b5"
SushiSwap_attack = "0x04b166e7b4ab5105a8e9c85f08f6346de1c66368687215b0e0b58d6e5002bc32"

projectName = ""
attack_tx = ""
pc = 1

let jsonData
quick_node_rpc = "https://lb.nodies.app/v1/181a5ebf4c954f8496ae7cbc1ac8d03b"

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
const alchemyTrace_optracer = async function (ProjectClass, ProjectName, attack_tx, pc) {
  try {
    const res = await axios.post(quick_node_rpc, {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "debug_traceTransaction",
      "params": [
        attack_tx,
        {
          enableMemory: true,
          disableStack: false,
          disableStorage: false,
          enableReturnData: true
        }
      ]
    }, config);
    sleep(1000)

    let dataToWrite = res.data.result;
    console.log(dataToWrite)

    let filePath;
    if (ProjectName.slice(-6) == "attack") {
      // filePath = `/root/WXZ/Large-Model-statistic/${ProjectClass}/attack/${ProjectName}_${pc}_tracer_logs.json`;
      filePath = `/home/kenijima/usr/work/LM/${ProjectClass}/attack/${ProjectName}_${pc}_tracer_logs.json`;
    } else {
      // filePath = `/root/WXZ/Large-Model-statistic/${ProjectClass}/total/${ProjectName}_${pc}_tracer_logs.json`;
      filePath = `/home/kenijima/usr/work/LM/${ProjectClass}/total/${ProjectName}_${pc}_tracer_logs.json`;
    }

    let jsonData = JSON.stringify(dataToWrite, null, 2);

    await fs.promises.writeFile(filePath, jsonData);
    console.log('JSON 数据已成功写入到文件中。');

    console.log(filePath);
    return filePath;
  } catch (error) {
    console.error('写入文件时出错：', error);
    throw error; // 抛出错误以便外部函数处理
  }
}

// alchemyTrace_optracer("sunshi_transaction", "0x04b166e7b4ab5105a8e9c85f08f6346de1c66368687215b0e0b58d6e5002bc32", 1)
module.exports = alchemyTrace_optracer;
// alchemyTrace_optracer("SushiSwap_attack", "0x902222631819ae3ecacdac96dd4c6ed88cf94b8bb8be0cab8aa39e6e8cde453e", 1)


// tracer: '{' +
// 'retVal: [],' +
// 'step: function(log,db) {' +
// ' if(log.op.toNumber() == 0x54) ' +
// ' this.retVal.push(log.getPC() + ": SLOAD " + ' +
// ' log.stack.peek(0).toString(16));' +
// ' if(log.op.toNumber() == 0x55) ' +
// ' this.retVal.push(log.getPC() + ": SSTORE " +' +
// ' log.stack.peek(0).toString(16) + " <- " +' +
// ' log.stack.peek(1).toString(16));' +
// '},' +
// 'fault: function(log,db) {this.retVal.push("FAULT: " + JSON.stringify(log))},
//  'result: function(ctx,db) {return this.retVal}' +
//  '}'
// const alchemyTrace_optracer = async function (projectName, attack_tx, pc) {
//   axios.post(quick_node_rpc, {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "debug_traceTransaction",
//     // "params": [uniswap_v2_attack, {"tracer": "prestateTracer", tracerConfig: {diffMode: true}}]
//     //      {enableMemory: true,
//     //     disableStack: false,
//     //     disableStorage: false,
//     //     enableReturnData: true}
//     "params": [
//       attack_tx,
//       // {"tracer":"{data: [], fault: function(log) {}, step: function(log) { if(log.op.toString() == '\''CALL'\'') this.data.push(log.stack.peek(0)); }, result: function() { return this.data; }}"}
//       {
//         enableMemory: true,
//         disableStack: false,
//         disableStorage: false,
//         enableReturnData: true
//       }
//     ]
//   }).then((res) => {
//     let dataToWrite = res.data.result
//     // ========================================================
//     // let all_calls = []
//     // dataToWrite.structLogs.map((element) => {
//     //     if (element.op === "SSTORE" || element.op === "CALL" || element.op === "DELEGATECALL") {
//     //         all_calls.push(element)
//     //     }
//     // });
//     // console.log(all_calls)

//     // =======================================================
//     // let all_ops = []
//     // dataToWrite.structLogs.map((element) => {
//     //     all_ops.push(element.op)
//     // });
//     //
//     // let write_op = {"all_ops": all_ops}

//     // 文件路径
//     let filePath;
//     if (projectName.slice(-6) == "attack") {
//       filePath = `/home/kenijima/usr/work/LM/DEX/attack/${projectName}_${pc}attack_tracer_logs.json`;
//     } else {
//       filePath = `/home/kenijima/usr/work/LM/DEX/total/${projectName}_${pc}attack_tracer_logs.json`;
//     }


//     // 将 JSON 数据转换为字符串
//     jsonData = JSON.stringify(dataToWrite, null, 2);

//     // 使用文件系统模块将 JSON 数据写入文件
//     fs.writeFile(filePath, jsonData, (err) => {
//       if (err) {
//         console.error('写入文件时出错：', err);
//       } else {
//         console.log('JSON 数据已成功写入到文件中。');
//       }
//     });

//     console.log(filePath)
//     return filePath;
//   }).catch((error) => { console.error(error) })
// }



