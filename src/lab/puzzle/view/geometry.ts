import { Cell } from "../core";

export interface BoardRect {
  left: number;
  top: number;
  width: number;
  height: number;
}

/** Cell under a contact point. The lifted piece is not the hit target. */
export function cellAtClientPoint(
  board: BoardRect,
  clientX: number,
  clientY: number,
  cellSize: number,
  columns: number,
  rows: number
): Cell | null {
  if (cellSize <= 0) {
    return null;
  }
  const localX = clientX - board.left;
  const localY = clientY - board.top;
  if (localX < 0 || localY < 0) {
    return null;
  }
  if (localX >= board.width || localY >= board.height) {
    return null;
  }
  const column = Math.floor(localX / cellSize);
  const row = Math.floor(localY / cellSize);
  if (column < 0 || row < 0 || column >= columns || row >= rows) {
    return null;
  }
  return { column: column, row: row };
}

/**
 * Gap between the contact point and the bottom of the lifted piece,
 * so a finger does not cover the shape.
 */
export const LIFT_GAP_PX = 36;

export function liftedGhostTopLeft(
  clientX: number,
  clientY: number,
  size: number
): { x: number; y: number } {
  return {
    x: clientX - size / 2,
    y: clientY - size - LIFT_GAP_PX,
  };
}
