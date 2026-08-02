// MoveHistory.tsx
import { RecordedMove } from "@/hooks/useChessGame"

interface MoveHistoryProps {
  moveHistory: RecordedMove[]
}

export function MoveHistory({ moveHistory }: MoveHistoryProps) {
  return (
    <div>
      {moveHistory.map((entry, index) => (
        <span key={index}>{entry.notation}</span>
      ))}
    </div>
  )
}