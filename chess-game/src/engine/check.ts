import { BoardState, Color, Move, Position } from "@/types/chess.types";
import { moveGenerators } from "./moveDispatcher";

export function findKing (board: BoardState, color: Color): Position {
  // Faz uma varredura pelo tabuleiro até encontrar um rei cor definida
  for (let row = 0; row <= 7; row++) {
    for (let col = 0; col <= 7; col++) {
      const piece = board[row][col]
      if (piece !== null && piece.type === 'king' && piece.color === color) {
        return {row, col}
      }
    }
  }

  throw new Error(`King not found for color: ${color}`);
}

export function isKingInCheck (board: BoardState, color: Color, lastMove: Move | null): boolean {
  const kingPosition = findKing(board, color)
  const opponentColor = color === 'white' ? 'black' : 'white'

  // também faz varredura no tabuleiro
  // Para cada peça (se existir na posição [row][col]) verifica se, entre seus lances legais, está o rei adversário
  for (let row = 0; row <= 7; row++) {
    for (let col = 0; col <= 7; col++) {
      const piece = board[row][col]
      if (piece !== null && piece.color === opponentColor) {
        const move = moveGenerators[piece.type](board, { row, col }, lastMove)
        if (move.includes(kingPosition)) {
          return true
        }
      }
    } 
  }

  return false
}