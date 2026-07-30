import { BoardState, PieceType, Position } from "@/types/chess.types";
import { getPawnMoves, getBishopMoves, getKnightMoves, getRookMoves, getQueenMoves, getKingMoves } from "./moveGenerator";

export const moveGenerators: Record<PieceType, (board: BoardState, pos: Position) => Position[]> = {
  pawn: getPawnMoves,
  knight: getKnightMoves,
  bishop: getBishopMoves,
  rook: getRookMoves,
  queen: getQueenMoves,
  king: getKingMoves,
};