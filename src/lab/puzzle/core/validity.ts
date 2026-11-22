import { GameState } from "./GameState";
import { Cell, Validity } from "./types";

/**
 * Placeholder rule: any in-bounds cell that does not hold a different piece.
 * Replace this function when the real rules exist. Core calls whatever
 * hook Game was given; it does not know why a move is legal.
 */
export type ValidityHook = (
  state: GameState,
  pieceId: string,
  to: Cell
) => Validity;

export function allowAnyEmptyCell(
  state: GameState,
  pieceId: string,
  to: Cell
): Validity {
  if (state.grid.contains(to) === false) {
    return { allowed: false, reason: "outside" };
  }
  const occupant = state.pieceAt(to);
  if (occupant !== null && occupant.id !== pieceId) {
    return { allowed: false, reason: "occupied" };
  }
  return { allowed: true };
}
