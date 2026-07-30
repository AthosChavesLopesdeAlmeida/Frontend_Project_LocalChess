import { Color, BoardState } from "@/types/chess.types";
import { getLegalMoves } from "./legalMoves";
import { getPieceAt } from "./board";
import { isKingInCheck } from "./check";

export function isStalemate (board: BoardState, color: Color): boolean {
  // Se ESTÁ em xeque, não pode ser stalemate (é outra situação)
  if (isKingInCheck(board, color)) {
    return false
  }

  let legalMoves = 0

  // Faz a varredura pelo tabuleiro, como várias outras funções
  for (let row = 0; row <= 7; row ++) {
    for (let col = 0; col <= 7; col++) {
      const piece = getPieceAt(board, {row: row, col: col})

      // Se a peça existe e é da cor das minhas
      if (piece === null || piece.color !== color) {
        continue
      } else {
        // Soma ao numero de lances legais
        const moves = getLegalMoves(board, {row: row, col: col})
        legalMoves += moves.length
      }
    }
  }

  return legalMoves === 0
}

export function isCheckmate (board: BoardState, color: Color): boolean {
  // Se NÃO está em xeque, não pode ser checkmate
  if (!isKingInCheck(board, color)) {
    return false
  }

  let legalMoves = 0

  // Faz a varredura pelo tabuleiro, como várias outras funções
  for (let row = 0; row <= 7; row ++) {
    for (let col = 0; col <= 7; col++) {
      const piece = getPieceAt(board, {row: row, col: col})

      // Se a peça existe e é da cor das minhas
      if (piece === null || piece.color !== color) {
        continue
      } else {
        // Soma ao numero de lances legais
        const moves = getLegalMoves(board, {row: row, col: col})
        legalMoves += moves.length
      }
    }
  }

  return legalMoves === 0
}