/**
 * Plain data for the board. These shapes map to Swift structs and enums.
 * Row 0 is the top of the board. Units are cells, never pixels.
 */

export interface Cell {
  column: number;
  row: number;
}

export function cellsEqual(a: Cell, b: Cell): boolean {
  return a.column === b.column && a.row === b.row;
}

export function copyCell(cell: Cell): Cell {
  return { column: cell.column, row: cell.row };
}

export type Shape = "circle" | "square" | "triangle" | "diamond";

export interface Piece {
  id: string;
  shape: Shape;
  colorToken: string;
  label: string;
}

export interface Placement {
  pieceId: string;
  cell: Cell;
}

/** What a popover action refers to. The view chooses the id; core does not. */
export type ActionTarget =
  | { kind: "cell"; cell: Cell }
  | { kind: "object"; objectId: string; cell: Cell };

export type GameEvent =
  | { type: "pieceSelected"; pieceId: string }
  | { type: "piecePlaced"; pieceId: string; cell: Cell }
  | { type: "moveRejected"; pieceId: string; cell: Cell; reason: string }
  | { type: "cellTapped"; cell: Cell }
  | { type: "objectTapped"; objectId: string; cell: Cell }
  | { type: "actionChosen"; actionId: string; target: ActionTarget };

export type Validity =
  | { allowed: true }
  | { allowed: false; reason: string };

export type GameListener = (event: GameEvent) => void;
