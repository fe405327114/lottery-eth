let Web3=require('web3')

let web3
if ( typeof window.web3!=='undefined'){
    web3=new Web3(window.web3.currentProvider)  //window.用来获取界面上的web3
    console.log("inject web3")
}else{
    web3=new Web3(new Web3.providers.HttpProvider('http://localhost:7545'))
    console.log("new web3")
}
// export default web3
module.exports=web3