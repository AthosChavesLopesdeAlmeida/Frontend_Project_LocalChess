import { BoardState, Position, Square } from "@/types/chess.types";

export function getPieceAt (board: BoardState, pos: Position): Square {
  if (!isInBounds(pos)) {
    return null
  }

  return board[pos.row][pos.col]
}

// Clona o tabuleiro com a peça no lugar novo
export function setPieceAt (board: BoardState, pos: Position, piece: Square): BoardState {
  const newBoard = cloneBoard(board)
  newBoard[pos.row][pos.col] = piece
  return newBoard
} 

export function cloneBoard (board: BoardState): BoardState {
  const newBoard: BoardState = Array.from({ length: 8 }, () =>
    Array.from({ length: 8 }, (): Square => null)
  );

  // Faz uma varredura de acordo com a notação (linha depois coluns)
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {

      // Verifica se existe uma peça na coordenada X
      const piece = board[row][col]
      if (piece !== null) {
        newBoard[row][col] = { ...piece }
      } else {
        newBoard[row][col] = null
      }
    }
  }

  // Retorna uma cópia completa atualizada do tabuleiro
  return newBoard
}

// Verifica se as colunas e linhas são >= 0 e <= 7
export function isInBounds (pos: Position): boolean {
  return pos.row >= 0 && pos.row <= 7 && pos.col >= 0 && pos.col <= 7
}