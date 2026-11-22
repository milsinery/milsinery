import { GameEvent } from "../core";

export type SoundKind =
  | "tap"
  | "select"
  | "pickup"
  | "place"
  | "reject"
  | "tool"
  | "fire"
  | "death"
  | "season";

/** Map a core event to a procedural sound. Pickup is a view gesture, not an event. */
export function soundForEvent(event: GameEvent): SoundKind | null {
  switch (event.type) {
    case "cellTapped":
      return "tap";
    case "objectTapped":
    case "trayTapped":
    case "topicTapped":
      return "select";
    case "actionAccepted":
      return event.via === "tool" ? "tool" : "place";
    case "actionRejected":
      return "reject";
    case "residentDied":
    case "gameLost":
      return "death";
    case "seasonChanged":
      return "season";
    case "fireChanged":
      return "fire";
    case "gameEnded":
    case "turnResolved":
      return null;
    default:
      return null;
  }
}

export function hapticForEvent(event: GameEvent): number | number[] {
  switch (event.type) {
    case "cellTapped":
    case "trayTapped":
    case "topicTapped":
      return 10;
    case "objectTapped":
      return 12;
    case "actionAccepted":
      return event.via === "tool" ? 12 : 20;
    case "actionRejected":
      return [14, 30, 18];
    case "residentDied":
    case "gameLost":
      return [20, 40, 30];
    case "seasonChanged":
      return 16;
    case "fireChanged":
      return [10, 20, 10];
    case "gameEnded":
    case "turnResolved":
      return 0;
    default:
      return 0;
  }
}

export const PICKUP_HAPTIC_MS = 16;
