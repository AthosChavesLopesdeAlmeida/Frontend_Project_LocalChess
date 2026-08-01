import { BoardState, Move, PieceType } from "@/types/chess.types";
import { getPieceAt } from "./board";
import { isCheckmate } from "./gameFinishers";
import { isKingInCheck } from "./check";
import { FILES } from "@/lib/constants";

export function moveToAlgebraic (move: Move, boardBeforeMove: BoardState, boardAfterMove: BoardState): string {
  const opponentColor = move.piece.color === 'white' ? 'black' : 'white'

  if (move.isCastle) {
    let castleNotation = move.isCastle === 'kingside' ? 'O-O' : 'O-O-O'

    if (isCheckmate(boardAfterMove, opponentColor, move)) {
      castleNotation += '#'
    } else if (isKingInCheck(boardAfterMove, opponentColor, move)) {
      castleNotation += '+'
    }

    return castleNotation
  }

  let moveNotation: string = ''
  const isCapture = getPieceAt(boardBeforeMove, move.to) !== null || move.isEnPassant

  switch (move.piece.type) {
    case 'bishop':
      moveNotation += 'B'
      break;
    case 'rook':
      moveNotation += 'R'
      break;
    case 'knight':
      moveNotation += 'N'
      break;
    case 'queen':
      moveNotation += 'Q'
      break;
    case 'king':
      moveNotation += 'K'
      break;
    case 'pawn':
      if (isCapture) {
        moveNotation += FILES[move.from.col] // letra da coluna de origem (ex: 'e' em "exd5")
      }
      break;
    default:
      break;
  }

  if (isCapture) {
    moveNotation += 'x'
  }

  moveNotation += FILES[move.to.col]
  moveNotation += String(8 - move.to.row) // converte índice interno pra número real da fileira

  if (move.promotion) {
    const promotionLetters: Record<PieceType, string> = {
      queen: 'Q', rook: 'R', bishop: 'B', knight: 'N',
      pawn: '', king: ''
    }
    moveNotation += `=${promotionLetters[move.promotion]}`
  }

  if (isCheckmate(boardAfterMove, opponentColor, move)) {
    moveNotation += '#'
  } else if (isKingInCheck(boardAfterMove, opponentColor, move)) {
    moveNotation += '+'
  }

  return moveNotation
}