import { BoardState, Position } from "@/types/chess.types";
import { getPieceAt, isInBounds } from "./board";
import { getCastlingMoves } from "./specialMoves";

// Função auxiliar para os movimentos da torre, do bispo e da rainha
function getSlidingMoves(board: BoardState, pos: Position, directions: [number, number][]): Position[] {
  const moves = []
  const origin = getPieceAt(board, pos)

  for (const [dRow, dCol] of directions) {
    // Soma a posição atual com a variação (delta, representado pela letra d) para saber até onde pode ir
    let current = {row: pos.row + dRow, col: pos.col + dCol}

    while (isInBounds(current)) {
      const target = getPieceAt(board, current)

      // Se a casa estiver vazia, movimento possível
      if (target === null) {
        moves.push(current)
      // Se houver uma peça adversária, movimento possível (captura)
      } else if (target.color !== origin?.color) { 
        moves.push(current)
        break
      } else {
        break // No caso em que a peça na casa X é minha
      } 

      // Vai fazendo tudo acima enquanto itera sobre as casas possíveis
      current = {row: current.row + dRow, col: current.col + dCol}
    }
  }

  return moves
}

export function getRookMoves (board: BoardState, pos: Position): Position[] {
  // Estabelece o padrão de movimentos legais da torre
  const offsets: [number, number][] = [[0, 1], [1, 0], [0, -1], [-1, 0]]
  return getSlidingMoves(board, pos, offsets)
}

export function getBishopMoves (board: BoardState, pos: Position): Position[] {
  // Estabelece o padrão de movimentos legais do bispo
  const offsets: [number, number][] = [[1, 1], [1, -1], [-1, 1], [-1, -1]]
  return getSlidingMoves(board, pos, offsets)
}

// Rainha funciona como uma torre e um bispo simultaneamente
export function getQueenMoves (board: BoardState, pos: Position): Position[] {
  return getRookMoves(board, pos).concat(getBishopMoves(board, pos))
}

export function getKnightMoves (board: BoardState, pos: Position): Position[] {
  // Estabelece o padrão de movimentos legais do cavalo
  const offsets = [[-2, -1],  [-2, 1], [-1, -2], [-1, 2],
                   [1, -2 ],  [1, 2 ], [2, -1 ], [2, 1 ]]

  const moves = []
  const piece = getPieceAt(board, pos) 

  for (const [dRow, dCol] of offsets) {
    // Soma a posição atual com a variação (delta, representado pela letra d)
    const target = {row: pos.row + dRow, col: pos.col + dCol}

    // Verifica se está nos limites
    if (isInBounds(target)) {
      const targetPiece = getPieceAt(board, target)
      // Se a peça em X coordenada for nula (não existe) ou de cor diferente da escolhida para o movimento
      // Adiciona essa movimentação às movimentações possíveis
      if (targetPiece === null || targetPiece.color !== piece?.color) {
        moves.push(target)
      }
    }  
  }
  
  return moves
}

export function getKingMoves (board: BoardState, pos: Position): Position[] {
  // Estabelece o padrão de movimentos legais do rei
  const offsets = [[-1,-1], [-1,0],  [-1,1],
                   [0,-1 ],          [0,1 ],
                   [1,-1 ], [ 1,0],  [1,1 ]]
  
  const moves= []
  const piece = getPieceAt(board, pos) 

  for (const [dRow, dCol] of offsets) {
    // Soma a posição atual com a variação (delta, representado pela letra d)
    const target = {row: pos.row + dRow, col: pos.col + dCol}

    // Verifica se está nos limites
    if (isInBounds(target)) {
      const targetPiece = getPieceAt(board, target)
      // Se a peça em X coordenada for nula (não existe) ou de cor diferente da escolhida para o movimento
      // Adiciona essa movimentação às movimentações possíveis
      if (targetPiece === null || targetPiece.color !== piece?.color) {
        moves.push(target)
      }
    }
  }

  // Roque
  if (piece) {
    const castlingMoves = getCastlingMoves(board, piece.color)
    return [...moves, ...castlingMoves]
  }

  return moves
}

export function getPawnMoves (board: BoardState, pos: Position): Position[] {
  const piece = getPieceAt(board, pos)
  const direction = piece?.color === 'black' ? -1 : 1
  const moves = []

  // avanço simples
  const advanceOne = {row: pos.row + direction, col: pos.col}
  if (isInBounds(advanceOne) && getPieceAt(board, advanceOne) === null) {
    // Se avançar uma casa for possível (está no tabuleiro e não houver uma peça na frente)
    moves.push(advanceOne)

    // Regras de avançar duas casas
    if (!piece?.hasMoved) {
      const advanceTwo = {row: pos.row + 2 * direction, col: pos.col}
      if (getPieceAt(board, advanceTwo) === null) {
        moves.push(advanceTwo)
      }
    }
  }

  // Regras de captura
  for (const dCol of [-1, 1]) {
    // diagonal = linha da posição + direção (1 ou -1) e coluna da posição + variação da coluna (delta)
    const diagonal = {row: pos.row + direction, col: pos.col + dCol}
    if (isInBounds(diagonal)) {
      const target = getPieceAt(board, diagonal)
      if (target !== null && target.color !== piece?.color) {
        moves.push(diagonal)
      }
    }
  }

  return moves
}