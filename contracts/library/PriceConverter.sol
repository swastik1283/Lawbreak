//SPDX-License-Identifier:MIT 

pragma solidity ^0.8.20;
import "../interface/AggregatorV3Interface.sol";
library PriceConverter{


    function  getPrice() internal view returns(uint256){
        AggregatorV3Interface pricefeed=AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);
        (,int256 answer,,,)=pricefeed.latestRoundData();
        return uint256(answer*1e10 );

    }

    function getconversionrate(uint256 ethamount) internal view returns(uint256){
        uint256 ethPrice=getPrice();
        uint256 ethamountinUsd=(ethPrice*ethamount)/1e18;
        return ethamountinUsd;
    }

function getVersion() internal view returns(uint256){
    return AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306).version();
}

}