let Web3 = require('web3')
let {interface, bytecode} = require('./compile')
// web3.setProvider(new Web3.providers.HttpProvider('http://localhost:8545'))


var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "scout same naive genius cannon maze differ acquire penalty habit surround ice"// 12 word mnemonic
var provider = new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/02cd1e3c295c425597fa105999493baa");
let web3 = new Web3(provider)

deploy = async () => {
    try {

        //获取部署账户
        accounts = await web3.eth.getAccounts()
        contractInstance = await new web3.eth.Contract(JSON.parse(interface)).deploy(
            {
                data: bytecode
                // arguments: ['']// 构造函数如果没有参数，就一定不要传
            }
        ).send({
            from: accounts[0],
            gas: '1000000'
        })

        console.log('address :', contractInstance.options.address)
    } catch (e) {
        console.log(e)
    }
}

deploy()
