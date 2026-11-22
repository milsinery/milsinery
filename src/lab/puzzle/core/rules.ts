import { cellIndex, inBounds, orthogonal } from "./board";
import { CONFIG } from "./config";
import { celestialOf, seasonOf } from "./time";
import {
  CardId,
  Cell,
  CellData,
  Cloud,
  GameState,
  ItemKind,
  RandomSource,
  ToolKind,
} from "./types";

export interface RuleNotes {
  died: boolean;
  seasonChanged: boolean;
  fire: boolean;
  lost: boolean;
  ended: boolean;
}

export function isTool(card: CardId): boolean {
  return card === "dig" || card === "fill" || card === "chop";
}

export function canPlay(
  state: GameState,
  card: CardId,
  cell: Cell
): { ok: true } | { ok: false; reason: string } {
  if (state.outcome !== "playing") {
    return { ok: false, reason: "over" };
  }
  if (inBounds(cell.column, cell.row) === false) {
    return { ok: false, reason: "outside" };
  }
  const data = state.cells[cellIndex(cell.column, cell.row)];
  if (data.fireAge > 0) {
    return { ok: false, reason: "burning" };
  }
  if (isTool(card)) {
    return canUseTool(state, card as ToolKind, data);
  }
  return canPlaceItem(state, card as ItemKind, data);
}

function canUseTool(
  state: GameState,
  tool: ToolKind,
  data: CellData
): { ok: true } | { ok: false; reason: string } {
  if (data.item !== null) {
    return { ok: false, reason: "occupied" };
  }
  if (tool === "dig" && data.terrain !== "earth") {
    return { ok: false, reason: "terrain" };
  }
  if (tool === "fill" && data.terrain !== "water") {
    return { ok: false, reason: "terrain" };
  }
  if (tool === "chop" && data.terrain !== "forest") {
    return { ok: false, reason: "terrain" };
  }
  return { ok: true };
}

function canPlaceItem(
  state: GameState,
  item: ItemKind,
  data: CellData
): { ok: true } | { ok: false; reason: string } {
  if (data.item !== null) {
    return { ok: false, reason: "occupied" };
  }
  if (item === "house" || item === "field") {
    if (data.terrain !== "earth") {
      return { ok: false, reason: "terrain" };
    }
  }
  if (item === "sawmill" || item === "hunter") {
    if (data.terrain !== "forest") {
      return { ok: false, reason: "terrain" };
    }
  }
  if (item === "boat" && data.terrain !== "water") {
    return { ok: false, reason: "terrain" };
  }
  if (state.resources.wood < itemCost(item)) {
    return { ok: false, reason: "cost" };
  }
  return { ok: true };
}

export function itemCost(item: ItemKind): number {
  if (item === "house") {
    return CONFIG.costHouse;
  }
  if (item === "sawmill") {
    return CONFIG.costSawmill;
  }
  if (item === "hunter") {
    return CONFIG.costHunter;
  }
  if (item === "boat") {
    return CONFIG.costBoat;
  }
  return CONFIG.costField;
}

/** Mutates a draft that the caller cloned. */
export function applyAction(state: GameState, card: CardId, cell: Cell): void {
  const data = state.cells[cellIndex(cell.column, cell.row)];
  if (card === "dig") {
    data.terrain = "water";
    data.forestWood = 0;
    data.forestFood = 0;
    return;
  }
  if (card === "fill") {
    data.terrain = "earth";
    return;
  }
  if (card === "chop") {
    data.terrain = "earth";
    data.forestWood = 0;
    data.forestFood = 0;
    state.resources.wood += CONFIG.chopWood;
    return;
  }
  const item = card as ItemKind;
  state.resources.wood -= itemCost(item);
  data.item = item;
  if (item === "house") {
    state.resources.residents += CONFIG.houseResidents;
  }
}

/**
 * One turn after a legal action.
 * Order: sun and summer fire, rain (spawn, extinguish, field bonus, flood),
 * production and forest drain, consumption, death, spoilage, fire spread
 * and aging, cloud drift, balance, advance the clocks.
 */
export function resolveTurn(state: GameState, random: RandomSource): RuleNotes {
  const notes: RuleNotes = {
    died: false,
    seasonChanged: false,
    fire: false,
    lost: false,
    ended: false,
  };
  const seasonBefore = seasonOf(state.turn);
  const sky = celestialOf(state.turn);
  const season = seasonOf(state.turn);

  const newborn: Cell[] = [];
  if (sky.phase === "day") {
    restoreForests(state, sky.column, season);
    if (season === "summer") {
      igniteSummerFields(state, sky.column, random, newborn);
      if (newborn.length > 0) {
        notes.fire = true;
      }
    }
  }

  settleRain(state, season, random);
  produce(state, season);
  const short = consume(state, notes);
  spoil(state);
  burn(state, notes, random, newborn);
  tickCloud(state);
  applyBalance(state, short);

  state.turn += 1;
  if (seasonOf(state.turn) !== seasonBefore) {
    notes.seasonChanged = true;
  }
  if (state.resources.residents <= 0) {
    state.outcome = "lost";
    notes.lost = true;
  } else if (state.turn >= state.length) {
    state.outcome = "ended";
    notes.ended = true;
  }
  return notes;
}

function restoreForests(
  state: GameState,
  column: number,
  season: ReturnType<typeof seasonOf>
): void {
  if (season === "winter") {
    return;
  }
  for (let row = 0; row < CONFIG.boardSize; row++) {
    const data = state.cells[cellIndex(column, row)];
    if (data.terrain !== "forest" || data.fireAge > 0) {
      continue;
    }
    let amount = CONFIG.sunForestRestore;
    if (nextToTerrain(state, column, row, "water")) {
      amount += CONFIG.waterForestBonus;
    }
    if (season === "spring") {
      amount = amount * CONFIG.springRegrowthMultiplier;
    }
    data.forestWood = clampStock(data.forestWood + amount);
    data.forestFood = clampStock(data.forestFood + amount);
  }
}

function clampStock(value: number): number {
  if (value > CONFIG.forestWoodStock) {
    return CONFIG.forestWoodStock;
  }
  return value;
}

function igniteSummerFields(
  state: GameState,
  column: number,
  random: RandomSource,
  newborn: Cell[]
): void {
  for (let row = 0; row < CONFIG.boardSize; row++) {
    const data = state.cells[cellIndex(column, row)];
    if (data.terrain !== "earth" || data.item !== "field" || data.fireAge > 0) {
      continue;
    }
    if (random.next() < CONFIG.summerFireChance) {
      data.fireAge = 1;
      newborn.push({ column: column, row: row });
    }
  }
}

function settleRain(
  state: GameState,
  season: ReturnType<typeof seasonOf>,
  random: RandomSource
): void {
  if (state.cloud === null) {
    const chance = season === "autumn" ? CONFIG.rainChanceAutumn : CONFIG.rainChance;
    if (random.next() < chance) {
      state.cloud = spawnCloud(random);
    }
  }
  if (state.cloud === null) {
    return;
  }
  extinguishUnderCloud(state, state.cloud);
  const covered = cellsUnderCloud(state.cloud);
  for (let index = 0; index < covered.length; index++) {
    const spot = covered[index];
    const data = state.cells[cellIndex(spot.column, spot.row)];
    if (data.item === "field" && data.fireAge === 0) {
      state.resources.food += CONFIG.rainFieldFood;
    }
  }
  flood(state, state.cloud, random);
}

function spawnCloud(random: RandomSource): Cloud {
  const maxOrigin = CONFIG.boardSize - CONFIG.cloudSize;
  const span = CONFIG.rainDurationMax - CONFIG.rainDurationMin + 1;
  const direction = Math.floor(random.next() * 4);
  const drifts: Array<{ column: number; row: number }> = [
    { column: 1, row: 0 },
    { column: -1, row: 0 },
    { column: 0, row: 1 },
    { column: 0, row: -1 },
  ];
  const drift = drifts[direction];
  return {
    column: Math.floor(random.next() * (maxOrigin + 1)),
    row: Math.floor(random.next() * (maxOrigin + 1)),
    turnsLeft: CONFIG.rainDurationMin + Math.floor(random.next() * span),
    driftColumn: drift.column,
    driftRow: drift.row,
  };
}

function extinguishUnderCloud(state: GameState, cloud: Cloud): void {
  const covered = cellsUnderCloud(cloud);
  for (let index = 0; index < covered.length; index++) {
    const spot = covered[index];
    const data = state.cells[cellIndex(spot.column, spot.row)];
    if (data.fireAge > 0) {
      data.fireAge = 0;
    }
  }
}

function cellsUnderCloud(cloud: Cloud): Cell[] {
  const spots: Cell[] = [];
  for (let row = cloud.row; row < cloud.row + CONFIG.cloudSize; row++) {
    for (let column = cloud.column; column < cloud.column + CONFIG.cloudSize; column++) {
      if (inBounds(column, row)) {
        spots.push({ column: column, row: row });
      }
    }
  }
  return spots;
}

function cloudHas(cloud: Cloud, column: number, row: number): boolean {
  return (
    column >= cloud.column &&
    row >= cloud.row &&
    column < cloud.column + CONFIG.cloudSize &&
    row < cloud.row + CONFIG.cloudSize
  );
}

function flood(state: GameState, cloud: Cloud, random: RandomSource): void {
  const waters = waterSet(state);
  const targets: Cell[] = [];
  for (let row = 0; row < CONFIG.boardSize; row++) {
    for (let column = 0; column < CONFIG.boardSize; column++) {
      if (cloudHas(cloud, column, row)) {
        continue;
      }
      if (touchesCloud(cloud, column, row) === false) {
        continue;
      }
      const data = state.cells[cellIndex(column, row)];
      if (data.terrain !== "earth" || data.fireAge > 0) {
        continue;
      }
      if (data.item !== null && data.item !== "field") {
        continue;
      }
      if (touchesWater(waters, column, row) === false) {
        continue;
      }
      targets.push({ column: column, row: row });
    }
  }
  for (let index = 0; index < targets.length; index++) {
    if (random.next() < CONFIG.floodChance) {
      const spot = targets[index];
      const data = state.cells[cellIndex(spot.column, spot.row)];
      data.terrain = "water";
      data.item = null;
      data.forestWood = 0;
      data.forestFood = 0;
      data.fireAge = 0;
    }
  }
}

function waterSet(state: GameState): boolean[] {
  const flags: boolean[] = [];
  for (let index = 0; index < state.cells.length; index++) {
    flags.push(state.cells[index].terrain === "water");
  }
  return flags;
}

function touchesWater(waters: boolean[], column: number, row: number): boolean {
  const neighbors = orthogonal(column, row);
  for (let index = 0; index < neighbors.length; index++) {
    const neighbor = neighbors[index];
    if (waters[cellIndex(neighbor.column, neighbor.row)]) {
      return true;
    }
  }
  return false;
}

function touchesCloud(cloud: Cloud, column: number, row: number): boolean {
  const neighbors = orthogonal(column, row);
  for (let index = 0; index < neighbors.length; index++) {
    const neighbor = neighbors[index];
    if (cloudHas(cloud, neighbor.column, neighbor.row)) {
      return true;
    }
  }
  return false;
}

function produce(state: GameState, season: ReturnType<typeof seasonOf>): void {
  for (let row = 0; row < CONFIG.boardSize; row++) {
    for (let column = 0; column < CONFIG.boardSize; column++) {
      const data = state.cells[cellIndex(column, row)];
      if (data.fireAge > 0) {
        continue;
      }
      if (data.item === "sawmill" && data.terrain === "forest") {
        if (data.forestWood > 0) {
          state.resources.wood += CONFIG.sawmillWood;
          data.forestWood -= 1;
          if (data.forestWood === 0) {
            data.terrain = "earth";
            data.item = null;
            data.forestFood = 0;
          }
        }
      } else if (data.item === "hunter" && data.terrain === "forest") {
        if (data.forestFood > 0) {
          state.resources.food += CONFIG.hunterFood;
          data.forestFood -= 1;
        }
      } else if (data.item === "boat" && data.terrain === "water") {
        state.resources.food += CONFIG.boatFood;
      } else if (data.item === "field" && data.terrain === "earth") {
        if (season !== "winter" && nextToTerrain(state, column, row, "water")) {
          state.resources.food += CONFIG.fieldFood;
        }
      }
      if (data.terrain === "water" && nextToItem(state, column, row, "house")) {
        state.resources.water += CONFIG.waterPerHouse;
      }
    }
  }
}

function nextToTerrain(
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

function nextToItem(
  state: GameState,
  column: number,
  row: number,
  item: ItemKind
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

function consume(state: GameState, notes: RuleNotes): boolean {
  const residents = state.resources.residents;
  const needFood = residents * CONFIG.foodPerResident;
  const needWater = residents * CONFIG.waterPerResident;
  const short =
    state.resources.food < needFood || state.resources.water < needWater;
  state.resources.food = Math.max(0, state.resources.food - needFood);
  state.resources.water = Math.max(0, state.resources.water - needWater);
  if (short) {
    state.resources.hunger += 1;
    if (state.resources.hunger >= CONFIG.hungerTurns) {
      state.resources.residents -= 1;
      state.resources.hunger = 0;
      notes.died = true;
    }
  } else {
    state.resources.hunger = 0;
  }
  return short;
}

function spoil(state: GameState): void {
  if (state.resources.residents <= 0) {
    return;
  }
  const cap = state.resources.residents * CONFIG.foodCapPerResident;
  if (state.resources.food > cap) {
    state.resources.food -= CONFIG.spoilagePerTurn;
  }
}

function burn(
  state: GameState,
  notes: RuleNotes,
  random: RandomSource,
  newborn: Cell[]
): void {
  const burning: Cell[] = [];
  for (let row = 0; row < CONFIG.boardSize; row++) {
    for (let column = 0; column < CONFIG.boardSize; column++) {
      const data = state.cells[cellIndex(column, row)];
      if (data.fireAge > 0 && listed(newborn, column, row) === false) {
        burning.push({ column: column, row: row });
      }
    }
  }
  if (spreadFrom(state, burning, random)) {
    notes.fire = true;
  }
  for (let index = 0; index < burning.length; index++) {
    const spot = burning[index];
    const data = state.cells[cellIndex(spot.column, spot.row)];
    if (data.fireAge === 0) {
      continue;
    }
    data.fireAge += 1;
    if (data.fireAge > CONFIG.fireBurnTurns) {
      data.terrain = "earth";
      data.item = null;
      data.forestWood = 0;
      data.forestFood = 0;
      data.fireAge = 0;
    }
  }
}

function listed(cells: Cell[], column: number, row: number): boolean {
  for (let index = 0; index < cells.length; index++) {
    if (cells[index].column === column && cells[index].row === row) {
      return true;
    }
  }
  return false;
}

function spreadFrom(
  state: GameState,
  burning: Cell[],
  random: RandomSource
): boolean {
  let started = false;
  for (let index = 0; index < burning.length; index++) {
    const spot = burning[index];
    const neighbors = orthogonal(spot.column, spot.row);
    for (let neighborIndex = 0; neighborIndex < neighbors.length; neighborIndex++) {
      const neighbor = neighbors[neighborIndex];
      const data = state.cells[cellIndex(neighbor.column, neighbor.row)];
      if (data.fireAge > 0) {
        continue;
      }
      const canBurn = data.terrain === "forest" || data.item === "field";
      if (canBurn === false) {
        continue;
      }
      if (random.next() < CONFIG.fireSpreadChance) {
        data.fireAge = 1;
        started = true;
      }
    }
  }
  return started;
}

function tickCloud(state: GameState): void {
  const cloud = state.cloud;
  if (cloud === null) {
    return;
  }
  cloud.turnsLeft -= 1;
  if (cloud.turnsLeft <= 0) {
    state.cloud = null;
    return;
  }
  const maxOrigin = CONFIG.boardSize - CONFIG.cloudSize;
  let nextColumn = cloud.column + cloud.driftColumn;
  let nextRow = cloud.row + cloud.driftRow;
  if (
    nextColumn < 0 ||
    nextRow < 0 ||
    nextColumn > maxOrigin ||
    nextRow > maxOrigin
  ) {
    cloud.driftColumn = -cloud.driftColumn;
    cloud.driftRow = -cloud.driftRow;
    nextColumn = cloud.column + cloud.driftColumn;
    nextRow = cloud.row + cloud.driftRow;
  }
  if (
    nextColumn < 0 ||
    nextRow < 0 ||
    nextColumn > maxOrigin ||
    nextRow > maxOrigin
  ) {
    return;
  }
  cloud.column = nextColumn;
  cloud.row = nextRow;
}

function applyBalance(state: GameState, short: boolean): void {
  let balance = state.resources.balance;
  const residents = state.resources.residents;
  if (short) {
    balance -= CONFIG.balanceDeficitStep;
  } else if (
    state.resources.food > 0 &&
    state.resources.water > 0 &&
    residents > 0
  ) {
    balance += CONFIG.balanceSurplusStep;
  }
  let nature = 0;
  let human = 0;
  for (let index = 0; index < state.cells.length; index++) {
    const data = state.cells[index];
    if (data.terrain === "forest" || data.terrain === "water") {
      nature += 1;
    }
    if (data.item !== null) {
      human += 1;
    }
  }
  if (human > nature) {
    balance += CONFIG.balanceDevelopmentStep;
  } else if (nature > human) {
    balance -= CONFIG.balanceNatureStep;
  }
  if (balance < CONFIG.balanceMin) {
    balance = CONFIG.balanceMin;
  }
  if (balance > CONFIG.balanceMax) {
    balance = CONFIG.balanceMax;
  }
  state.resources.balance = balance;
}

export function countItem(state: GameState, item: ItemKind): number {
  let count = 0;
  for (let index = 0; index < state.cells.length; index++) {
    if (state.cells[index].item === item) {
      count += 1;
    }
  }
  return count;
}
