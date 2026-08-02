// components/board/Square.tsx
import { Square as SquareType, Position } from '@/types/chess.types';
import PieceComponent from './Piece';
import { FILES } from '@/lib/constants';

interface SquareProps {
  piece: SquareType;
  position: Position;
  isLight: boolean;
  isHighlighted: boolean    // possibleMoves (já existe)
  isCapture: boolean        // possibleMoves + tem peça adversária
  isLastMove: boolean       // origem ou destino do último lance
  isKingInCheck: boolean    // só true na casa do rei ameaçado
  onClick: () => void
}

export function Square({ piece, position, isLight, onClick, isHighlighted, isCapture, isLastMove, isKingInCheck }: SquareProps) {
  return (
    <div className={`square ${isLight ? 'square-light' : 'square-dark'} ${isKingInCheck ? 'square-check' : ''} ${isLastMove ? 'square-recent' : ''}`}  
    onClick={onClick}>
      {piece && <PieceComponent piece={piece} />}

      {position.col === 0 && (
        <span className="coord coord-rank">{8 - position.row}</span>
      )}

      {position.row === 7 && (
        <span className="coord coord-file">{FILES[position.col]}</span>
      )}

      {isHighlighted ? <span className='move-mark'></span> : null}

      {isCapture ? <span className='capture-mark'></span> : null}
    </div>
  );
}