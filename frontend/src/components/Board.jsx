import React, { useState, useEffect } from "react";
import socket from "../socket.js";
import Dice from "./Dice";

const Board = () => {
  const size = 10;
  const [players, setPlayers] = useState({});
  const [currentTurn, setCurrentTurn] = useState(null);
  const [myId, setMyId] = useState(null);

  // build board cells
  const cells = [];
  for (let row = size - 1; row >= 0; row--) {
    for (let col = 0; col < size; col++) {
      const num =
        row % 2 === 0 ? row * size + col + 1 : row * size + (size - col);
      cells.push(
        <div
          key={num}
          className="relative flex items-center justify-center border border-gray-400 w-12 h-12 text-sm font-medium"
        >
          {num}
          {/* show player markers */}
          {Object.values(players)
            .filter((p) => p.score === num)
            .map((p, i) => (
              <div
                key={p.id}
                className={`absolute bottom-${i * 4} w-4 h-4 rounded-full ${
                  p.id === myId ? "bg-blue-500" : "bg-red-500"
                }`}
              ></div>
            ))}
        </div>
      );
    }
  }

  useEffect(() => {
    socket.on("connect", () => setMyId(socket.id));

    socket.on("players-update", (data) => {
      const playerObj = {};
      data.forEach((p) => {
        playerObj[p.id] = p;
      });
      setPlayers(playerObj);
    });

    socket.on("gamestart", ({ players, turn }) => {
      setCurrentTurn(turn);
    });

    socket.on("turn-change", ({ turn }) => {
      setCurrentTurn(turn);
    });

    socket.on("game-over", ({ winner, scores }) => {
      alert(
        winner
          ? `Game Over! Winner: ${winner}`
          : `Game Over! It's a tie!`
      );
    });

    return () => {
      socket.off("connect");
      socket.off("players-update");
      socket.off("game-start");
      socket.off("turn-change");
      socket.off("game-over");
    };
  }, []);

  return (
    <div>
      <div className="flex flex-row items-center justify-center mt-3 ml-2">
        <div className="grid grid-cols-10 w-max border border-black">
          {cells}
        </div>
        <div className="mt-2 ml-2">
          <Dice playerId={myId} currentTurn={currentTurn} />
        </div>
      </div>
    </div>
  );
};

export default Board;
