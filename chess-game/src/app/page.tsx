'use client'
import BoardComponent from "@/components/board/Board"
import { useChessGame } from "@/hooks/useChessGame"

const Page = () => {
  const { boardState, possibleMoves, selectedSquare, moveHistory, currentTurn, handleSquareClick } = useChessGame()
  const lastMove = moveHistory.length > 0 ? moveHistory[moveHistory.length - 1].move : null

  return (
    <div>
      <BoardComponent
        board={boardState}
        possibleMoves={possibleMoves}
        selectedSquare={selectedSquare}
        lastMove={lastMove}
        currentTurn={currentTurn}
        onSquareClick={handleSquareClick}
      />
    </div>
  )
}

export default Page