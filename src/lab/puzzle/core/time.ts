import { CONFIG } from "./config";
import { PhaseName, SeasonName } from "./types";

export const SEASON_ORDER: SeasonName[] = [
  "spring",
  "summer",
  "autumn",
  "winter",
];

/** Season clock. Independent of the day/night walk. */
export function seasonOf(turn: number): SeasonName {
  const length = SEASON_ORDER.length;
  const index = Math.floor(turn / CONFIG.seasonTurns) % length;
  return SEASON_ORDER[index];
}

export function celestialOf(turn: number): { phase: PhaseName; column: number } {
  const cycle = CONFIG.dayColumns + CONFIG.nightColumns;
  const index = turn % cycle;
  if (index < CONFIG.dayColumns) {
    return { phase: "day", column: index };
  }
  return { phase: "night", column: index - CONFIG.dayColumns };
}
