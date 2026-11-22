import { CONFIG } from "./config";
import {
  Cell,
  CellData,
  Cloud,
  Deltas,
  GameState,
  ItemKind,
  RandomSource,
  Resources,
  Terrain,
} from "./types";

export function cellIndex(column: number, row: number): number {
  return row * CONFIG.boardSize + column;
}

export function inBounds(column: number, row: number): boolean {
  return (
    column >= 0 &&
    row >= 0 &&
    column < CONFIG.boardSize &&
    row < CONFIG.boardSize
  );
}

export function makeTerrain(terrain: Terrain): CellData {
  if (terrain === "forest") {
    return {
      terrain: "forest",
      forestWood: CONFIG.forestWoodStock,
      forestFood: CONFIG.forestFoodStock,
      item: null,
      fireAge: 0,
    };
  }
  return {
    terrain: terrain,
    forestWood: 0,
    forestFood: 0,
    item: null,
    fireAge: 0,
  };
}

export function copyCellData(cell: CellData): CellData {
  return {
    terrain: cell.terrain,
    forestWood: cell.forestWood,
    forestFood: cell.forestFood,
    item: cell.item,
    fireAge: cell.fireAge,
  };
}

export function orthogonal(column: number, row: number): Cell[] {
  const found: Cell[] = [];
  const steps: Cell[] = [
    { column: 1, row: 0 },
    { column: -1, row: 0 },
    { column: 0, row: 1 },
    { column: 0, row: -1 },
  ];
  for (let index = 0; index < steps.length; index++) {
    const nextColumn = column + steps[index].column;
    const nextRow = row + steps[index].row;
    if (inBounds(nextColumn, nextRow)) {
      found.push({ column: nextColumn, row: nextRow });
    }
  }
  return found;
}

export function zeroDeltas(): Deltas {
  return { wood: 0, food: 0, water: 0, residents: 0, balance: 0 };
}

export function startingResources(): Resources {
  return {
    wood: CONFIG.startWood,
    food: CONFIG.startFood,
    water: CONFIG.startWater,
    residents: CONFIG.startResidents,
    hunger: 0,
    balance: 0,
  };
}

export function copyResources(resources: Resources): Resources {
  return {
    wood: resources.wood,
    food: resources.food,
    water: resources.water,
    residents: resources.residents,
    hunger: resources.hunger,
    balance: resources.balance,
  };
}

export function copyCloud(cloud: Cloud | null): Cloud | null {
  if (cloud === null) {
    return null;
  }
  return {
    column: cloud.column,
    row: cloud.row,
    turnsLeft: cloud.turnsLeft,
    driftColumn: cloud.driftColumn,
    driftRow: cloud.driftRow,
  };
}

export function cloneState(state: GameState): GameState {
  const cells: CellData[] = [];
  for (let index = 0; index < state.cells.length; index++) {
    cells.push(copyCellData(state.cells[index]));
  }
  return {
    cells: cells,
    resources: copyResources(state.resources),
    turn: state.turn,
    length: state.length,
    cloud: copyCloud(state.cloud),
    lastDeltas: {
      wood: state.lastDeltas.wood,
      food: state.lastDeltas.food,
      water: state.lastDeltas.water,
      residents: state.lastDeltas.residents,
      balance: state.lastDeltas.balance,
    },
    outcome: state.outcome,
  };
}

function hasTerrain(cells: CellData[], terrain: Terrain): boolean {
  for (let index = 0; index < cells.length; index++) {
    if (cells[index].terrain === terrain) {
      return true;
    }
  }
  return false;
}

function terrainCount(cells: CellData[], terrain: Terrain): number {
  let count = 0;
  for (let index = 0; index < cells.length; index++) {
    if (cells[index].terrain === terrain) {
      count += 1;
    }
  }
  return count;
}

/** A cell whose terrain appears more than once, so it can be overwritten. */
function indexOfSpare(cells: CellData[]): number {
  const kinds: Terrain[] = ["earth", "forest", "water"];
  for (let kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
    if (terrainCount(cells, kinds[kindIndex]) > 1) {
      for (let index = 0; index < cells.length; index++) {
        if (cells[index].terrain === kinds[kindIndex]) {
          return index;
        }
      }
    }
  }
  return 0;
}

export function generateBoard(random: RandomSource): CellData[] {
  const total = CONFIG.boardSize * CONFIG.boardSize;
  const kinds: Terrain[] = ["earth", "forest", "water"];
  const cells: CellData[] = [];
  for (let index = 0; index < total; index++) {
    const pick = Math.floor(random.next() * kinds.length);
    cells.push(makeTerrain(kinds[pick]));
  }
  for (let kindIndex = 0; kindIndex < kinds.length; kindIndex++) {
    if (hasTerrain(cells, kinds[kindIndex]) === false) {
      cells[indexOfSpare(cells)] = makeTerrain(kinds[kindIndex]);
    }
  }
  for (let index = 0; index < cells.length; index++) {
    if (cells[index].terrain === "earth") {
      const placed = copyCellData(cells[index]);
      placed.item = "house";
      cells[index] = placed;
      break;
    }
  }
  return cells;
}

export function itemAt(cells: CellData[], column: number, row: number): ItemKind | null {
  return cells[cellIndex(column, row)].item;
}
