pragma solidity ^0.4.24;
contract Lottery {
//定义状态变量
//生成合约地址的管理员
address public manager;
//所有参与的彩民
address[] public players;
//中奖人
address public winner;
//彩票期数
uint public round;

//设置管理员
constructor()public payable{
  //部署时第一次调用者是管理员
  manager=msg.sender;
}
//下注方法
function play()public payable {
  //限定一次投1个以太币
  require(msg.value==1 ether);
  players.push(msg.sender);
}

//开奖方法
function draw()public onlyOwner {
  //开奖前检验有效性，无人参与不开奖
   require(players.length!=0);
  //利用区块难度值，当前时间，和参与人数 生成随机数值
uint bigInt=uint(sha3(block.difficulty,now,players.length));
//产生中奖人
uint index=bigInt%players.length;
winner=players[index];
//获得奖金
winner.transfer(address(this).balance);
//期数增加
round++;
//清空参与人
delete players;
}

//利用函数修饰符，只允许manager调用draw,drawback方法
modifier onlyOwner(){
  require(manager==msg.sender);
  _; //修饰符必须包含_
}

//退奖方法
function drawback()public onlyOwner{
  require(players.length!=0);
  // 遍历数组，逐一退奖
  for(uint i=0;i<players.length;i++){
    players[i].transfer(1 ether);
  }
  round++;
  delete players;
}

//参与人数
function getAmount()public view returns(uint){
  return players.length;
}
//奖金池金额
function getTotalMoney()public view returns(uint256){
  return address(this).balance;
}
//中奖者
function getWinner()public view returns(address){
  return winner;
}
//当前期数
function getRonud()public view returns(uint){
  return round;
}
//参与人
function getPlayers()public view returns(address[]){
  return players;
}
//管理员地址
function getmanager()public view returns(address){
  return manager;
}
}
