import { cloneBoard, setPieceAt, getPieceAt } from "./board";
import { Move, BoardState } from "@/types/chess.types";

// Clona o tabuleiro com o novo movimento feito
export function makeMove(board: BoardState, move: Move): BoardState {
  let newBoard = cloneBoard(board)
  const pieceMovida = { ...move.piece, hasMoved: true }

  newBoard = setPieceAt(newBoard, move.from, null)
  newBoard = setPieceAt(newBoard, move.to, pieceMovida)

  // Se for roque, move a torre também
  if (move.isCastle) {
    const row = move.from.row
    const rookFromCol = move.isCastle === 'kingside' ? 7 : 0
    const rookToCol = move.isCastle === 'kingside' ? 5 : 3

    const rook = getPieceAt(newBoard, { row, col: rookFromCol })
    if (rook) {
      newBoard = setPieceAt(newBoard, { row, col: rookFromCol }, null)
      newBoard = setPieceAt(newBoard, { row, col: rookToCol }, { ...rook, hasMoved: true })
    }
  }

  return newBoard
}