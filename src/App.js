import React, {Component} from 'react';
import web3 from './web3/initWeb3'

class App extends Component {
    render() {
        //调用web3
        web3.eth.getAccounts().then(accounts => {
            console.log(accounts)
        })
        console.log("web3 version :", web3.version)
        return (
            <p>Hello world</p>
        );
    }
}

export default App;
