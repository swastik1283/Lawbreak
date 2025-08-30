import React, { useState } from 'react';
import dice1 from '../assets/dice1.jpg'
import dice2 from '../assets/dice2.jpg'
import dice3 from '../assets/dice3.jpg'
import dice4 from '../assets/dice4.jpg'
import dice5 from '../assets/dice5.jpg'
import dice6 from '../assets/dice6.jpg'
const Dice = () => {
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);
  const[player1,setplayer1]=useState(6);
  const[player2,setplayer2]=useState(6);

  const[turn,setturn]=useState(1);

  const handleroll=(diceValue)=>{
    if(turn===1){
      setplayer1(prev=>prev+diceValue)
      setturn(2);
    }
    else{
      setplayer2(prev=>prev+diceValue);
      setturn(1);

    }
  }

  const diceImages = { 1: dice1, 2: dice2, 3: dice3, 4: dice4,5:dice5,6:dice6 };

  const rollDice = () => {
    setRolling(true);
    let rolls = 10;
    const interval = setInterval(() => {
      const rand = Math.floor(Math.random() * 6) + 1; // 1-4
      setDiceValue(rand);
      handleroll(rand)
      rolls--;
      if (rolls === 0) {
        clearInterval(interval);
        setRolling(false);
      
      }
    }, 100);
  };

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
          disabled={rolling}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {rolling ? 'Rolling...' : 'Roll Dice'}
        </button>
     
     </div>
  );
};

export default Dice;
