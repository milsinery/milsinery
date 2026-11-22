import { cellIndex, orthogonal } from "./board";
import { CONFIG } from "./config";
import { seasonOf } from "./time";
import { CellData, GameState } from "./types";

export type YieldResource = "wood" | "food" | "water";

/** What one cell adds to a stockpile on the coming turn. */
export interface CellYield {
  column: number;
  row: number;
  resource: YieldResource;
  amount: number;
}

/**
 * Preview of per-cell production for the turn about to be played.
 * Matches produce(), plus rain on a field, and treats a fire under the
 * current cloud as already put out (rain runs before production).
 */
export function cellYields(state: GameState): CellYield[] {
  const season = seasonOf(state.turn);
  const found: CellYield[] = [];
  for (let row = 0; row < CONFIG.boardSize; row++) {
    for (let column = 0; column < CONFIG.boardSize; column++) {
      const data = state.cells[cellIndex(column, row)];
      const underCloud = covered(state, column, row);
      if (data.fireAge > 0 && underCloud === false) {
        continue;
      }
      pushCell(found, state, data, column, row, season, underCloud);
    }
  }
  return found;
}

function pushCell(
  found: CellYield[],
  state: GameState,
  data: CellData,
  column: number,
  row: number,
  season: ReturnType<typeof seasonOf>,
  underCloud: boolean
): void {
  if (data.item === "sawmill" && data.terrain === "forest" && data.forestWood > 0) {
    found.push({
      column: column,
      row: row,
      resource: "wood",
      amount: CONFIG.sawmillWood,
    });
  } else if (data.item === "hunter" && data.terrain === "forest" && data.forestFood > 0) {
    found.push({
      column: column,
      row: row,
      resource: "food",
      amount: CONFIG.hunterFood,
    });
  } else if (data.item === "boat" && data.terrain === "water") {
    found.push({
      column: column,
      row: row,
      resource: "food",
      amount: CONFIG.boatFood,
    });
  } else if (data.item === "field" && data.terrain === "earth") {
    let food = 0;
    if (season !== "winter" && beside(state, column, row, "water")) {
      food += CONFIG.fieldFood;
    }
    if (underCloud) {
      food += CONFIG.rainFieldFood;
    }
    if (food > 0) {
      found.push({ column: column, row: row, resource: "food", amount: food });
    }
  }
  if (data.terrain === "water" && besideItem(state, column, row, "house")) {
    found.push({
      column: column,
      row: row,
      resource: "water",
      amount: CONFIG.waterPerHouse,
    });
  }
}

function covered(state: GameState, column: number, row: number): boolean {
  const cloud = state.cloud;
  if (cloud === null) {
    return false;
  }
  return (
    column >= cloud.column &&
    row >= cloud.row &&
    column < cloud.column + CONFIG.cloudSize &&
    row < cloud.row + CONFIG.cloudSize
  );
}

function beside(
  state: GameState,
  column: number,
  row: number,
  terrain: CellData["terrain"]
): boolean {
  const neighbors = orthogonal(column, row);
  for (let index = 0; index < neighbors.length; index++) {
    const neighbor = neighbors[index];
    const data = state.cells[cellIndex(neighbor.column, neighbor.row)];
    if (data.terrain === terrain) {
      return true;
    }
  }
  return false;
}

function besideItem(
  state: GameState,
  column: number,
  row: number,
  item: CellData["item"]
): boolean {
  const neighbors = orthogonal(column, row);
  for (let index = 0; index < neighbors.length; index++) {
    const neighbor = neighbors[index];
    const data = state.cells[cellIndex(neighbor.column, neighbor.row)];
    if (data.item === item) {
      return true;
    }
  }
  return false;
}
