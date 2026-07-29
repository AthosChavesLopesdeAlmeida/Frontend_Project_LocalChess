// components/board/Square.tsx
import { Square as SquareType, Position } from '@/types/chess.types';
import PieceComponent from './Piece';
import { FILES } from '@/lib/constants';

interface SquareProps {
  piece: SquareType;
  position: Position;
  isLight: boolean;
}

export function Square({ piece, position, isLight }: SquareProps) {
  return (
    <div className={`square ${isLight ? 'square-light' : 'square-dark'}`}>
      {piece && <PieceComponent piece={piece} />}

      {position.col === 0 && (
        <span className="coord coord-rank">{8 - position.row}</span>
      )}

      {position.row === 7 && (
        <span className="coord coord-file">{FILES[position.col]}</span>
      )}
    </div>
  );
}