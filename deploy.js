// let web3=require('../src/web3/initWeb3')
// import web3 from './src/web3/initWeb3'
let Web3=require('web3')
let web3=new Web3()
 web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))
//let provider=new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/02cd1e3c295c425597fa105999493baa")
// let web3=new Web3(provider)
//接收编译后的abi和bytecode
// let {interface,bytecode}=require('./compile')
let output=require('./compile')
let abiInter=output.interface
let bytecode=output.bytecode
//部署
 deploy=async()=>{
try {
    //获取账户
    let accounts=await web3.eth.getAccounts()
    //合约实例
    let contractIns=await new web3.eth.Contract(JSON.parse(abiInter)).deploy({
        data:bytecode,
        //arguments:['']    //如果有构造函数，这里需要传入argumens
    }).send({
        from:accounts[0],
        gas:1000000
    })
    //打印一下部署的地址
    console.log("部署的合约地址为：",contractIns.options.address)
}catch (e) {
    console.log(e)
}
}
deploy()

//部署合约，获得合约地址，以供contractIns模块进行合约实例化