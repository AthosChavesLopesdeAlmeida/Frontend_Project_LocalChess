'use client'
import { BoardState } from '@/types/chess.types';
import { Square } from './Square';

interface BoardProps {
  board: BoardState;
}

export function BoardComponent({ board }: BoardProps) {
  return (
    <div className="board-grid">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          const isLight = (rowIndex + colIndex) % 2 === 0;

          return (
            <Square
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              position={{ row: rowIndex, col: colIndex }}
              isLight={isLight}
            />
          );
        })
      )}
    </div>
  );
}
export default BoardComponent