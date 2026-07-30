import { getPieceAt } from "@/engine/board";
import { Position, BoardState } from "@/types/chess.types";
import { useState } from "react";
import { moveGenerators } from "@/engine/moveDispatcher";

export function HandleSquareClick (board: BoardState, clickedSquare: Position): Position[] {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([])
  const clickedPiece = getPieceAt(board, clickedSquare)

  // Se nenhuma peça está selecionada
  if (selectedSquare === null) {
    // Se a casa selecionada não está vazia
    if (clickedSquare !== null) {
      setSelectedSquare(clickedSquare)

      // Pega a função para a peça selecionada (acima) e usa ela
      const generateMoves = moveGenerators[clickedPiece!.type]
      const moves = generateMoves(board, clickedSquare)

      setPossibleMoves(moves)
    }
  } else {
    // Se a posição clicada é igual a posição já selecionada, 'deseleciona' (se é que esta palavra existe)
    if (clickedSquare === selectedSquare) {
      setPossibleMoves([])
      setSelectedSquare(null)
      // Jogada de verdade
    } else if (possibleMoves.includes(clickedSquare)) {
      //
    } else if (clickedPiece !== null) {
      // Clica em outra peça própria, muda a seleção
      setSelectedSquare(clickedSquare)

      const generateMoves = moveGenerators[clickedPiece!.type]
      const moves = generateMoves(board, clickedSquare)

      setPossibleMoves(moves)
    } else {
      setSelectedSquare(null)
      setPossibleMoves([])
    }
  }

  return possibleMoves
}