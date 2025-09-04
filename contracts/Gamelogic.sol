//SPDX-License-Identifier:MIT

pragma solidity ^0.8.20;

import "./library/PriceConverter.sol";


contract Gamelogic{
    uint256 public constant MINIMUM_USD=2e18;

    

    uint256 amount;


error notOwner();

address public immutable i_owner;


constructor (){
    i_owner=msg.sender;
}

modifier Onlyadmin(){
    if(msg.sender!=i_owner){
   revert notOwner();
    }
    _;
}


address[] public payers ;


mapping(address payer=>uint256 totalamount) public totalamountreceived;

function add() public payable{
   require(msg.value.getconversionrate()>=MINIMUM_USD,"didnt send enough ETH");
   payers.push(msg.sender);
   totalamountreceived[msg.sender]=totalamountreceived[msg.sender]+msg.value;
}
   function withdraw(uint256 totalamount)public Onlyadmin {

   }

   function AddPlayermeta(uint256 player1meta,uint256 player2meta )public{
               
   }
   function AddMoney() public payable{
        
   }


    
}