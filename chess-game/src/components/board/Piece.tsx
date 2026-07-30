'use client'
import { PIECE_SYMBOLS } from "@/lib/piecesMap"
import { Piece } from "@/types/chess.types"

// Piece.tsx
interface PieceProps {
  piece: Piece; // ou PieceType, dependendo de como você nomeou o tipo
}

export default function PieceComponent({ piece }: PieceProps) {
  const key = `${piece.color}-${piece.type}`;
  const symbol = PIECE_SYMBOLS[key];

  return <span className="piece-symbol">{symbol}</span>;
}