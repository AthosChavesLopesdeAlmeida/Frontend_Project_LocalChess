import { BoardState, Move, Position } from "@/types/chess.types";
import { moveGenerators } from "./moveDispatcher";
import { makeMove } from "./gameState";
import { getPieceAt } from "./board";
import { isKingInCheck } from "./check";

export function getLegalMoves (board: BoardState, pos: Position, lastMove: Move | null): Position[] {
  const piece = getPieceAt(board, pos)

  if (piece === null) {
    return [] // não tem peça na origem, não há movimentos possíveis
  }

  const pseudoLegalMoves = moveGenerators[piece.type](board, pos, lastMove)

  const legalMoves: Position[] = []

  for (const move of pseudoLegalMoves) {
    // Simula o lance
    const simulationMove: Move = {from: pos, to: move, piece: piece}

    // Se for peão mudando de coluna pra uma casa vazia, é captura en passant —
    // precisa marcar pra que makeMove remova o peão capturado também na simulação
    const destinationPiece = getPieceAt(board, move)
    if (piece.type === 'pawn' && move.col !== pos.col && destinationPiece === null) {
      simulationMove.isEnPassant = true
    }

    const simulationBoard  = makeMove(board, simulationMove)

    // Se o rei desse jogador não ficou em cheque, adiciona esse lance como um lance legal
    if (!isKingInCheck(simulationBoard, piece.color)) {
      legalMoves.push(move)
    }
  }

  return legalMoves
}