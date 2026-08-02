'use client'
import { getPieceAt } from "@/engine/board";
import { makeMove } from "@/engine/gameState";
import { Position, BoardState, Move, PieceType } from "@/types/chess.types";
import { useState } from "react";
import { createInitialBoard } from "@/lib/constants";
import { getLegalMoves } from "@/engine/legalMoves";
import { isPromotion } from "@/engine/specialMoves";
import { moveToAlgebraic } from "@/engine/notation";

export interface RecordedMove {
  move: Move
  notation: string
}

export function useChessGame() {
  const [selectedSquare, setSelectedSquare] = useState<Position | null>(null)
  const [currentTurn, setCurrentTurn] = useState<'white' | 'black'>('white') 
  const [pendingPromotion, setPendingPromotion] = useState<Move | null>(null)
  const [possibleMoves, setPossibleMoves] = useState<Position[]>([])
  const [boardState, setBoardState] = useState<BoardState>(createInitialBoard())
  const [moveHistory, setMoveHistory] = useState<RecordedMove[]>([])

  // Função auxiliar para que o hook não precise de parâmetros
  function handleSquareClick(clickedSquare: Position) {
    const clickedPiece = getPieceAt(boardState, clickedSquare)
    const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].move : null

    // Se nenhuma peça está selecionada
    if (selectedSquare === null) {
      // Se a casa selecionada não está vazia e se é da cor das minha peças
      if (clickedPiece !== null && currentTurn === clickedPiece.color) {
        setSelectedSquare(clickedSquare)

        // Pega a função para a peça selecionada (acima) e usa ela
        const moves = getLegalMoves(boardState, clickedSquare, lastMove)

        setPossibleMoves(moves)
      }
    } else {
      // Se a posição clicada é igual a posição já selecionada, 'deseleciona' (se é que esta palavra existe)
      if (clickedSquare === selectedSquare) {
        setPossibleMoves([])
        setSelectedSquare(null)
        // Jogada de verdade
      } else if (possibleMoves.includes(clickedSquare)) {
        // Pega a peça que vai ser movida
        const movingPiece = getPieceAt(boardState, selectedSquare)

        if (movingPiece !== null) {
          const move: Move = { from: selectedSquare, to: clickedSquare, piece: movingPiece }

          // Detecta roque: rei andando 2 casas
          if (movingPiece.type === 'king' && Math.abs(clickedSquare.col - selectedSquare.col) === 2) {
            move.isCastle = clickedSquare.col > selectedSquare.col ? 'kingside' : 'queenside'
          }

          // peão mudou de coluna (captura diagonal) mas a casa de destino está vazia - En Passant
          if (movingPiece.type === 'pawn' && clickedSquare.col !== selectedSquare.col && clickedPiece === null) {
            move.isEnPassant = true
          }

          // Detecta promoção: peão chega na última casa
          if (isPromotion(clickedSquare, movingPiece)) {
            // Pausa o movimento — espera o usuário escolher a peça no modal
            setPendingPromotion(move)
            setSelectedSquare(null)
            setPossibleMoves([])
            return
          }

          const newBoard = makeMove(boardState, move)
          const notation = moveToAlgebraic(move, boardState, newBoard)

          setBoardState(newBoard)
          setSelectedSquare(null)
          setPossibleMoves([])
          setMoveHistory([...moveHistory, { move, notation }])
          setCurrentTurn(currentTurn === 'white' ? 'black' : 'white')
        }
      } else if (clickedPiece !== null && currentTurn === clickedPiece.color) {
        // Clica em outra peça própria, muda a seleção
        setSelectedSquare(clickedSquare)

        const moves = getLegalMoves(boardState, clickedSquare, lastMove)

        setPossibleMoves(moves)
      } else {
        setSelectedSquare(null)
        setPossibleMoves([])
      }
    }
  }

  // Chamada pelo modal quando o usuário escolhe a peça de promoção
  function confirmPromotion(chosenType: PieceType) {
    if (pendingPromotion === null) return

    const move: Move = { ...pendingPromotion, promotion: chosenType }
    const newBoard = makeMove(boardState, move)
    const notation = moveToAlgebraic(move, boardState, newBoard)

    setBoardState(newBoard)
    setMoveHistory([...moveHistory, { move, notation }])
    setCurrentTurn(currentTurn === 'white' ? 'black' : 'white')
    setPendingPromotion(null)
  }

  return {
    boardState,
    selectedSquare,
    possibleMoves,
    currentTurn,
    moveHistory,
    pendingPromotion,
    handleSquareClick,
    confirmPromotion,
  }
}