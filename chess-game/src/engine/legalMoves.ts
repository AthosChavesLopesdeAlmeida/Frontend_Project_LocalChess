import { BoardState, Position } from "@/types/chess.types";
import { moveGenerators } from "./moveDispatcher";
import { makeMove } from "./gameState";
import { getPieceAt } from "./board";
import { isKingInCheck } from "./check";

export function getLegalMoves (board: BoardState, pos: Position): Position[] {
  const piece = getPieceAt(board, pos)

  if (piece === null) {
    return [] // não tem peça na origem, não há movimentos possíveis
  }

  const pseudoLegalMoves = moveGenerators[piece.type](board, pos)



  const legalMoves: Position[] = []

  for (const move of pseudoLegalMoves) {
    // Simula o lance
    const simulationMove = {from: pos, to: move, piece: piece}
    const simulationBoard  = makeMove(board, simulationMove)

    // Se o rei desse jogador não ficou em cheque, adiciona esse lance como um lance legal
    if (!isKingInCheck(simulationBoard, piece.color)) {
      legalMoves.push(move)
    }
  }

  return legalMoves
}