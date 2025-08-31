import React, { useEffect, useState } from 'react';
import socket from '../socket.js';
import dice1 from '../assets/dice1.jpg'
import dice2 from '../assets/dice2.jpg'
import dice3 from '../assets/dice3.jpg'
import dice4 from '../assets/dice4.jpg'
import dice5 from '../assets/dice5.jpg'
import dice6 from '../assets/dice6.jpg'
const Dice = () => {
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);
  const[playerId,setplayerId]=useState(null);
  const[currentTurn,setCurrentTurn]=useState(null);
  const[myTurn,setMyTurn]=useState(false);



  const diceImages = { 1: dice1, 2: dice2, 3: dice3, 4: dice4,5:dice5,6:dice6 };

  useEffect(()=>{
    const handleConnect=()=>{
    setplayerId(socket.id);
    }
    setMyTurn(currentTurn===playerId);

    socket.on("player-rolled",({playerId,dice})=>{
      setDiceValue(dice);
       setRolling(false);
    })

    socket.on("turn-change",({turn})=>{
      setCurrentTurn(turn)
        setMyTurn(turn===playerId);
            });

    return()=>{
       socket.off("connect", handleConnect);
      socket.off("player-rolled");
      socket.off("turn-change");
    };
},[playerId,currentTurn])

useEffect(()=>{
  setMyTurn(currentTurn===playerId);

},[currentTurn,playerId])
  const rollDice = () => {
    if(!myTurn) return ;
    setRolling(true);

    socket.emit("roll-dice");
  }
  return (
  
<div>
        <div className="mb-6">
          {diceValue ? (
            <img
              src={diceImages[diceValue]}
              alt={`Dice ${diceValue}`}
              className={`w-32 h-32 transition-transform duration-100 ${
                rolling ? 'animate-bounce' : ''
              }`}
            />
          ) : (
            <p className="text-gray-400 text-4xl">Roll Me!</p>
          )}
        </div>

        <button
          onClick={rollDice}
          disabled={rolling || !myTurn}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {rolling ? 'Rolling...' :myTurn?'Roll Dice':"Wait..."}
        </button>
     
     </div>
  );
};

export default Dice;
