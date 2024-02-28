const axios = require('axios') //alchemy
const fs = require('fs');
const https = require('https');
// const time = require('time')


const agent = new https.Agent({
  rejectUnauthorized: false, // 如果你的 HTTPS 请求需要验证 SSL 证书，可以将此选项设置为 true
  keepAlive: true
});

const config = {
  timeout: 10000, // 设置超时时间为 5 秒
  httpsAgent: agent // 使用自定义的 httpsAgent
};



let jsonData
quick_node_rpc = "https://lb.nodies.app/v1/181a5ebf4c954f8496ae7cbc1ac8d03b"

projectName = ""
attack_tx = ""
pc = 1


function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
const alchemyTrace_calltracer = async function (ProjectClass, ProjectName, attack_tx, pc) {
  try {
    const res = await axios.post(quick_node_rpc, {
      "jsonrpc": "2.0",
      "id": 1,
      "method": "debug_traceTransaction",
      "params": [
        attack_tx,
        {
          "tracer": "callTracer"
        }
      ]
    }, config);

    sleep(1000)

    let dataToWrite = res.data.result;

    let filePath;
    if (ProjectName.slice(-6) == "attack") {
      // filePath = `/root/WXZ/Large-Model-statistic/${ProjectClass}/attack/${ProjectName}_${pc}_call_tracer.json`;
      filePath = `/home/kenijima/usr/work/LM/${ProjectClass}/attack/${ProjectName}_${pc}_call_tracer.json`;
    } else {
      // filePath = `/root/WXZ/Large-Model-statistic/${ProjectClass}/total/${ProjectName}_${pc}_call_tracer.json`;
      filePath = `/home/kenijima/usr/work/LM/${ProjectClass}/total/${ProjectName}_${pc}_call_tracer.json`;
    }

    let jsonData = JSON.stringify(dataToWrite, null, 2);

    await fs.promises.writeFile(filePath, jsonData);
    console.log('JSON 数据已成功写入到文件中。');

    return filePath;
  } catch (error) {
    console.error('写入文件时出错：', error);
    throw error;
  }
}


// alchemyTrace_calltracer("SushiSwap_attack", "0x04b166e7b4ab5105a8e9c85f08f6346de1c66368687215b0e0b58d6e5002bc32", 1)
module.exports = alchemyTrace_calltracer;


// const alchemyTrace_calltracer = async function (projectName, attack_tx, pc) {
//   axios.post(quick_node_rpc, {
//     "jsonrpc": "2.0",
//     "id": 1,
//     "method": "debug_traceTransaction",
//     "params": [
//       attack_tx,
//       {
//         "tracer": "callTracer"
//       }
//     ]
//     // "params": [
//     //     uniswap_v2_attack,
//     //     {
//     //         "tracer": "{ data: [], fault: function(log) {}, step: function(log) { \
//     //             if(log.op.toString() == '\''CALL'\'') this.data.push(log.stack.peek(0)); \
//     //         }, result: function() { return this.data; }}"
//     //     }
//     // ]
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
//       filePath = `/home/kenijima/usr/work/LM/DEX/attack/${projectName}_${pc}_call_tracer.json`;
//     } else {
//       filePath = `/home/kenijima/usr/work/LM/DEX/total/${projectName}_${pc}_call_tracer.json`;
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

//     return filePath;
//   }).catch((error) => { console.error(error) })
// }




