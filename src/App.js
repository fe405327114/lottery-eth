import React, {Component} from 'react';
import web3 from './web3/initWeb3'
import lotteryContract from './contractIns/getInstance'
import CardExampleCard from './view/ui'

class App extends Component {
    // state  函数内部传递参数
    //props  函数之间传递参数
    constructor(props) {
        super(props)
        //设置状态变量(react内置)
        this.state = {
            manager: '',
            currentAccount: '',
            players: [],
            winner: '',
            round: 0,
            playersCount: 0,
            balance: 0,  //单位是wei
            isPlaying: false, //标识这个play按钮的当前状态
            isKaiJiangZhong: false,
            isTuiJiangZhong: false,
            buttonControl: '',  //管理员：inline， 普通用户：none

        }
    }

    //组件加载后立即执行 componentDidMount
    async componentDidMount() {
        //通过web3获取合约信息
        let accounts = await web3.eth.getAccounts()
        let manager = await lotteryContract.methods.getmanager().call({from: accounts[0]})
        let players = await lotteryContract.methods.getPlayers().call({from: accounts[0]})
        let winner = await lotteryContract.methods.getWinner().call({from: accounts[0]})
        let round = await lotteryContract.methods.getRonud().call({from: accounts[0]})
        let playersCount = await lotteryContract.methods.getPlayers().call({from: accounts[0]})
        //wei单位，要转成eth单位
        let balance = await lotteryContract.methods.getTotalMoney().call({from: accounts[0]})
        this.setState({
            // manager : manager,
            manager, //同名的变量可以直接简写
            //getAccounts方法返回的就是当前的账户地址集合，accounts[0]是当前的调用地址
            currentAccount: accounts[0],
            players,
            winner,
            round,
            playersCount,
            balance: web3.utils.fromWei(balance, 'ether')
        })
        if (manager === accounts[0]) {
            //管理员则显示
            this.setState({buttonControl: 'inline'})
        } else {
            this.setState({buttonControl: 'none'})
        }
    }
//方法调用
//投注
play = async () => {
    //正在执行时 isPlaying为true
    this.state = ({isPlaying: true})
    try {
        let accounts = await web3.eth.getAccounts()
        //调用play方法
        await lotteryContract.methods.play().send({  //注意是send方法
            from: accounts[0],
            value: 1 * 10 ** 18  //单位是 wei
        })
        //弹框
        alert("投注成功")
        this.state = ({isPlaying: false})
        //刷新页面
        window.location.reload(true)
    } catch (e) {
        this.setState({isPlaying: false})
        alert('投注失败!')
        console.log(e)
    }
}
draw = async () => {
    //判断一下，如果已经点击了，但是没有处理完成，那么不允许再次调用合约的play方法
    this.setState({isKaiJiangZhong: true})
    //1. 调用合约的play方法
    try {
        let accounts = await web3.eth.getAccounts()
        await lotteryContract.methods.draw().send({
            from: accounts[0], //重新获取一次比较稳妥
            // value: 1 * 10 ** 18 //wei //开奖不需要转钱
        })
        //弹框
        let winner = await lotteryContract.methods.winner().call({from: accounts[0]})
        this.setState({winner})
        // alert(`本期赢家: ${this.state.winner}`)
        alert(`本期赢家: ${winner}`)
        this.setState({isKaiJiangZhong: false})
        //这是为了自动刷新页面,可以不加，然后手动刷新
        window.location.reload(true)
    } catch (e) {
        this.setState({isKaiJiangZhong: false})
        alert('开奖失败!')
        console.log(e)
    }
}
drawback = async () => {
    //判断一下，如果已经点击了，但是没有处理完成，那么不允许再次调用合约的play方法
    this.setState({isTuiJiangZhong: true})
    //1. 调用合约的play方法
    try {
        let accounts = await web3.eth.getAccounts()
        await lotteryContract.methods.drawback().send({
            from: accounts[0], //重新获取一次比较稳妥
            // value: 1 * 10 ** 18 //wei
        })
        //弹框
        alert('退奖成功!')
        this.setState({isTuiJiangZhong: false})
        //这是为了自动刷新页面,可以不加，然后手动刷新
        window.location.reload(true)
    } catch (e) {
        this.setState({isTuiJiangZhong: false})
        alert('退奖失败!')
        console.log(e)
    }
}
//只要有一个按钮被点击了，那么三个按钮都应该被disable
isDisable = () => {
    return this.state.isPlaying || this.state.isKaiJiangZhong || this.state.isTuiJiangZhong
}
render() {
    return (
        <div className="App">
            <CardExampleCard
                manager={this.state.manager}
                currentAccount={this.state.currentAccount}
                players={this.state.players}
                winner={this.state.winner}
                round={this.state.round}
                playersCount={this.state.playersCount}
                balance={this.state.balance}
                play={this.play}
                isPlaying={this.state.isPlaying}
                draw={this.draw}
                isKaiJiangZhong={this.state.isKaiJiangZhong}
                drawback={this.drawback}
                isTuiJiangZhong={this.state.isTuiJiangZhong}
                isDisable={this.isDisable}
                buttonControl={this.state.buttonControl}
            />
        </div>
    )
}
}
export default App;
