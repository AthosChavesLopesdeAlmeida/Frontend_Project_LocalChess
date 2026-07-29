export type Color = 'white' | 'black'
export type PieceType = 'pawn' | 'knight' | 'rook' | 'bishop' | 'queen' | 'king'

export interface Piece {
  type: PieceType,
  color: Color,
  hasMoved: boolean // essencial pra roque e avanço duplo do peão
}

export type Square = Piece | null
export type BoardState = Square[][] // ou Map<string, Piece> com chave "e4"

export interface Position {
  row: number; // 0-7
  col: number; // 0-7
}

export interface Move {
  from: Position;
  to: Position;
  piece: Piece;
  captured?: Piece;
  isCastle?: 'kingside' | 'queenside';
  isEnPassant?: boolean;
  promotion?: PieceType;
}
