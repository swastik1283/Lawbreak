import React, { useState, useEffect } from "react";
import socket from "../socket.js";
import dice1 from "../assets/dice1.jpg";
import dice2 from "../assets/dice2.jpg";
import dice3 from "../assets/dice3.jpg";
import dice4 from "../assets/dice4.jpg";
import dice5 from "../assets/dice5.jpg";
import dice6 from "../assets/dice6.jpg";

const Board = () => {
  const size = 10;
  const [players, setPlayers] = useState({});
  const [currentTurn, setCurrentTurn] = useState(null);
  const [myId, setMyId] = useState(null);
  const [diceValue, setDiceValue] = useState(null);
  const [rolling, setRolling] = useState(false);

  const diceImages = { 1: dice1, 2: dice2, 3: dice3, 4: dice4, 5: dice5, 6: dice6 };

  // Build board cells
  const cells = [];
  for (let row = size - 1; row >= 0; row--) {
    for (let col = 0; col < size; col++) {
      const num = row % 2 === 0 ? row * size + col + 1 : row * size + (size - col);
      cells.push(
        <div
          key={num}
          className="relative flex items-center justify-center border border-gray-400 w-12 h-12 text-sm font-medium"
        >
          {num}
          {/* Player tokens */}
          {Object.values(players)
            .filter((p) => Number(p.position) === num)
            .map((p, i) => (
              <div
                key={p.id}
                className={`absolute w-4 h-4 rounded-full ${p.id === myId ? "bg-blue-500" : "bg-red-500"}`}
                style={{ bottom: `${i * 10}px` }}
              ></div>
            ))}
        </div>
      );
    }
  }

  // Roll dice function
  const rollDice = () => {
    if (currentTurn !== myId || rolling) return;
    setRolling(true);
    socket.emit("roll-dice");
  };

  useEffect(() => {
    socket.on("connect", () => setMyId(socket.id));

    socket.on("players-update", (data) => {
      const obj = {};
      data.forEach((p) => (obj[p.id] = p));
      setPlayers(obj);
      if (!currentTurn && Object.keys(obj).length) setCurrentTurn(Object.keys(obj)[0]);
    });

    socket.on("gamestart", ({ players: playerIds, turn }) => {
      setCurrentTurn(turn);
    });

    socket.on("turn-change", ({ turn }) => {
      setCurrentTurn(turn);
    });

    socket.on("player-rolled", ({ playerId, dice, position, score }) => {
      setPlayers((prev) => ({
        ...prev,
        [playerId]: { ...prev[playerId], position, score },
      }));
      setDiceValue(dice);
      setRolling(false);
    });

    socket.on("game-over", ({ winner }) => {
      alert(winner ? `Game Over! Winner: ${winner === myId ? "You" : winner}` : "Game Over! It's a tie!");
    });

    return () => {
      socket.off("connect");
      socket.off("players-update");
      socket.off("gamestart");
      socket.off("turn-change");
      socket.off("player-rolled");
      socket.off("game-over");
    };
  }, [myId, currentTurn]);

  return (
    <div className="flex flex-row items-start justify-center mt-3 ml-2">
      <div className="grid grid-cols-10 w-max border border-black">{cells}</div>

      {/* Dice and roll button */}
      <div className="ml-6">
        <div className="mb-6">
          {diceValue ? (
            <img
              src={diceImages[diceValue]}
              alt={`Dice ${diceValue}`}
              className={`w-32 h-32 transition-transform duration-100 ${rolling ? "animate-bounce" : ""}`}
            />
          ) : (
            <p className="text-gray-400 text-4xl">Roll Me!</p>
          )}
        </div>
        <button
          onClick={rollDice}
          disabled={rolling || currentTurn !== myId}
          className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {rolling ? "Rolling..." : currentTurn === myId ? "Roll Dice" : "Wait..."}
        </button>
      </div>
    </div>
  );
};

export default Board;
