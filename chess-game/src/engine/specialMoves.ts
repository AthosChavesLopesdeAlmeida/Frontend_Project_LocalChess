import { BoardState, Color, Piece, Position, Move } from "@/types/chess.types";
import { isKingInCheck, findKing } from "./check";
import { getPieceAt } from "./board";
import { makeMove } from "./gameState";

// Verifica se as casas estão vazias para que o rei possa fazer o roque
function areSquaresEmpty (board: BoardState, row: number, fromCol: number, toCol: number): boolean {
  for (let col = fromCol; col <= toCol; col++) {
    if (getPieceAt(board, {row, col}) !== null) {
      return false
    }
  }

  return true
}

// As funções abaixo são funções auxiliares para sabermos se determinada casa está sendo atacada por uma peça adversária
function squareIsAttacked (board: BoardState, color: Color, pos: Position): boolean | null {
  const kingPosition = findKing(board, color)
  const king = getPieceAt(board, kingPosition)

  if (!king) return null

  const simulatedMove = {from: kingPosition, to: pos, piece: king}
  const simulatedBoard = makeMove(board, simulatedMove)

  return isKingInCheck(simulatedBoard, color)
}

function isSquareSafe (board: BoardState, color: Color, row: number, cols: number[]): boolean {
  for (const col of cols) {
    if (squareIsAttacked(board, color, {row, col})) {
      return false
    }
  }

  return true
}

export function getCastlingMoves (board: BoardState, color: Color): Position[] {
  const castlingMoves: Position[] = []
  const kingRow = color === 'black' ? 0 : 7
  const king = board[kingRow][4]

  // Se o rei não existe (improvável, mas pode haver bug), se moveu ou está em cheque, não pode fazer roque
  if (!king) return []
  if (king.hasMoved) return []
  if (isKingInCheck(board, color)) return []

  // Pega a torre do lado do rei
  const rookKingSide = getPieceAt(board, {row: kingRow, col: 7})
  // Se a torre existe e nunca se moveu
  if (rookKingSide && rookKingSide.type === 'rook' && !rookKingSide.hasMoved) {
    // Se as casas entre a torre e o rei não estão ocupadas nem atacadas (no primeiro caso, incluindo a casa do rei)
    if (areSquaresEmpty(board, kingRow, 5, 6)) {
      if (isSquareSafe(board, color, kingRow, [4, 5, 6])) {
        // Então o movimento é válido
        castlingMoves.push({ row: kingRow, col: 6 })
      }
    }
  }

  // Pega a torre do lado da rainha
  const rookQueenSide = getPieceAt(board, {row: kingRow, col: 0})
  // Se a torre existe e nunca se moveu
  if (rookQueenSide && rookQueenSide.type === 'rook' && !rookQueenSide.hasMoved) {
    // Se as casas entre a torre e o rei não estão ocupadas nem atacadas (no primeiro caso, incluindo a casa do rei)
    if (areSquaresEmpty(board, kingRow, 1, 3)) {
      if (isSquareSafe(board, color, kingRow, [4, 3, 2])) {
        // Então o movimento é válido
        castlingMoves.push({ row: kingRow, col: 2 })
      }
    }
  }

  return castlingMoves
}

export function isPromotion (pos: Position, piece: Piece): boolean {
  if (piece.type !== 'pawn') return false

  const lastRow = piece.color === 'white' ? 0 : 7
  return pos.row === lastRow
}


// Regra de En passant
export function getEnPassant (board: BoardState, pos: Position, lastMove: Move | null): Position[] {
  // retorna [] ou [{row, col}] com a casa de captura en passant, se válida
  const moves: Position[] = []
  const piece = getPieceAt(board, pos)

  if (!piece) return moves

  // Verifica várias coisas: 1) Se existe um lance anterior 2)foi um peão andando duas casas 3) Se está do lado do meu peão
  if (lastMove && lastMove.piece.type === 'pawn') {
    if (Math.abs(lastMove.from.row - lastMove.to.row) === 2) {
      if (lastMove.to.row === pos.row && (lastMove.to.col - 1 === pos.col || lastMove.to.col + 1 === pos.col)) {
        const direcao = piece.color === 'white' ? -1 : 1
        const targetRow = pos.row + direcao
        const targetCol = lastMove.to.col

        moves.push({row: targetRow, col: targetCol})
      }
    }
  }

  return moves
}