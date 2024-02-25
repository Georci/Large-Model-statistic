require('events').EventEmitter.defaultMaxListeners = 20;
const fetch = require("node-fetch");

// 本文件实现了API获取函数名称以及个数

async function fetchData(func_selector) {
    console.log("1111:", func_selector)
    const url = 'https://api.openchain.xyz/signature-database/v1/lookup?function=' + func_selector + '&filter=true';
    try {
        await console.log("请求之前的哈希值", func_selector)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000 // 设置超时时间为 10 秒
        });

        // await console.log(func_selector)
        const data = await response.json();
        // 检查是否有有效数据
        if (data && data.ok && data.result && data.result.function && data.result.function[func_selector]) {
            // 获取函数名称和过滤信息
            const functionName = data.result.function[func_selector][0].name;
            const isFiltered = data.result.function[func_selector][0].filtered;
            await console.log('Function Name:', functionName);
            return functionName;
            // await console.log('Filtered:', isFiltered);
        } else {
            // await console.log("当前传入的：", func_selector)
            await console.error('Invalid response format or missing data');
        }
    } catch (error) {
        await console.log("当前传入的: ", func_selector)
        await console.error('Error fetching data:', error);
        // throw error;
    }
};

// 调用 fetchData 函数并等待 Promise 被解决
// (async () => {
//     try {
//         await fetchData();
//     } catch (error) {
//         console.error('Error:', error);
//     }
// })();
// fetchData('0x128acb08')

module.exports = fetchData;
