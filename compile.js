let solc=require('solc')
let fs=require('fs')
//读取合约文件
let fileInfo=fs.readFileSync('./contracts/lottery.sol',"utf-8") //千万不要忘记，要加上utf-8
//编译
let output=solc.compile(fileInfo)
// console.log(output)
//导出
module.exports=output['contracts'][':Lottery']
