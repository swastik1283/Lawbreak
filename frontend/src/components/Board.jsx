import React from "react";
import Dice from "./Dice";
const Board = () => {
  const size = 10;
  const cells = [];

  for (let row = size - 1; row >= 0; row--) {
    for (let col = 0; col < size; col++) {
      const num =
        row % 2 === 0 ? row * size + col + 1 : row * size + (size - col);

      cells.push(
        <div
          key={num}
          className="flex items-center justify-center border border-gray-400 w-12 h-12 text-sm font-medium"
        >
          {num}
        </div>
      );
    }
  }

  return (
    <div>
      <div className="flex flex-row items-center justify-center mt-3 ml-2">
    <div className="grid grid-cols-10 w-max border border-black">
      {cells}

          </div>
<div className="mt-2 ml-2 justify-content-right">
 <Dice/>
</div>
        </div>
        </div>
  );
};

export default Board;
