'use client'
import { BoardState, Position, Move } from '@/types/chess.types';
import { Square } from './Square';
import { isKingInCheck, findKing } from '@/engine/check';


interface BoardProps {
  board: BoardState;
  possibleMoves: Position[];
  selectedSquare: Position | null; 
  lastMove: Move | null;            
  currentTurn: 'white' | 'black';
  onSquareClick: (pos: Position) => void; 
}

export function BoardComponent({ board, possibleMoves, lastMove, currentTurn, onSquareClick }: BoardProps) {
  // Calulado fora pois já varre todo o tabuleiro
  const kingInCheckPos = isKingInCheck(board, currentTurn, lastMove)
  ? findKing (board, currentTurn)
  : null 

  return (
    <div className="board-grid">
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => {
          // Calcula se é uma casa clara ou escura
          const isLight = (rowIndex + colIndex) % 2 === 0;

          // Calcula se a casa está em um movimento possível
          const isHighlighted = possibleMoves.some(
            m => m.row === rowIndex && m.col === colIndex
          )

          // Verifica se, dentre os movimentos possíveis, está uma peça a ser capturada
          const isCapture = isHighlighted && piece !== null

          // Verifica a casa de origem e de destino (após o lance)
          const isLastMove = lastMove !== null && (
            (lastMove.from.row === rowIndex && lastMove.from.col === colIndex) ||
            (lastMove.to.row === rowIndex && lastMove.to.col === colIndex)
          )

          // Verifica se ESTA casa está em cheque
          const isChecked = kingInCheckPos !== null && (
            kingInCheckPos.row === rowIndex &&
            kingInCheckPos.col === colIndex 
          )

          return (
            <Square
            key={`${rowIndex}-${colIndex}`}
            piece={piece}
            position={{ row: rowIndex, col: colIndex }}
            isLight={isLight}
            isHighlighted={isHighlighted} 
            isCapture={isCapture}
            isLastMove={isLastMove}
            isKingInCheck={isChecked}
            onClick = {() => onSquareClick({row: rowIndex, col: colIndex})}
            />
          );
        })
      )}
    </div>
  );
}
export default BoardComponent