import { GameEvent } from "../core";

export type SoundKind = "tap" | "select" | "pickup" | "place" | "reject";

/** Map a core event to a procedural sound. Pickup is a view gesture, not an event. */
export function soundForEvent(event: GameEvent): SoundKind | null {
  switch (event.type) {
    case "cellTapped":
      return "tap";
    case "objectTapped":
      return "select";
    case "pieceSelected":
      return "select";
    case "piecePlaced":
      return "place";
    case "moveRejected":
      return "reject";
    case "actionChosen":
      return "tap";
    default:
      return null;
  }
}

export function hapticForEvent(event: GameEvent): number | number[] {
  switch (event.type) {
    case "cellTapped":
      return 10;
    case "objectTapped":
      return 12;
    case "pieceSelected":
      return 12;
    case "piecePlaced":
      return 20;
    case "moveRejected":
      return [14, 30, 18];
    case "actionChosen":
      return 8;
    default:
      return 0;
  }
}

export const PICKUP_HAPTIC_MS = 16;
