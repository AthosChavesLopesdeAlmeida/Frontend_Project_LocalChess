import { BoardState, Color, PieceType, Position, Square } from '@/types/chess.types';

export const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// Ordem das peças na fileira principal (esquerda pra direita)
const BACK_ROW_ORDER: PieceType[] = [
  'rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook',
];

export function createInitialBoard(): BoardState {
  const board: BoardState = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, (): Square => null)
  );

  for (let col = 0; col < 8; col++) {
    // linha 0: peças pretas | linha 1: peões pretos
    board[0][col] = createPiece(BACK_ROW_ORDER[col], 'black');
    board[1][col] = createPiece('pawn', 'black');

    // linha 6: peões brancos | linha 7: peças brancas
    board[6][col] = createPiece('pawn', 'white');
    board[7][col] = createPiece(BACK_ROW_ORDER[col], 'white');
  }

  return board;
}

function createPiece(type: PieceType, color: Color) {
  return { type, color, hasMoved: false };
}

export function positionToAlgebraic(pos: Position): string {
  const letra = FILES[pos.col];
  const numero = 8 - pos.row; // linha 0 = fileira 8 (pretas em cima), linha 7 = fileira 1
  return `${letra}${numero}`;
}