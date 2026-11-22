import { CONFIG } from "./config";
import { Game } from "./Game";
import { makeTerrain } from "./board";
import { CellData } from "./types";
import { cellYields } from "./yields";

function board(edits: Array<{ column: number; row: number; cell: CellData }>): CellData[] {
  const cells: CellData[] = [];
  const total = CONFIG.boardSize * CONFIG.boardSize;
  for (let index = 0; index < total; index++) {
    cells.push(makeTerrain("earth"));
  }
  for (let index = 0; index < edits.length; index++) {
    const edit = edits[index];
    cells[edit.row * CONFIG.boardSize + edit.column] = edit.cell;
  }
  return cells;
}

function amounts(
  yields: ReturnType<typeof cellYields>,
  column: number,
  row: number
): string[] {
  const lines: string[] = [];
  for (let index = 0; index < yields.length; index++) {
    const item = yields[index];
    if (item.column === column && item.row === row) {
      lines.push(item.resource + ":" + item.amount);
    }
  }
  return lines;
}

describe("cell yields", () => {
  test("shows what a working building and a watered field add", () => {
    const game = new Game({
      cells: board([
        { column: 0, row: 0, cell: { ...makeTerrain("forest"), forestWood: 3, item: "sawmill" } },
        { column: 1, row: 0, cell: { ...makeTerrain("forest"), forestFood: 2, item: "hunter" } },
        { column: 2, row: 0, cell: { ...makeTerrain("water"), item: "boat" } },
        { column: 3, row: 0, cell: { ...makeTerrain("earth"), item: "field" } },
        { column: 4, row: 0, cell: makeTerrain("water") },
        { column: 0, row: 2, cell: { ...makeTerrain("earth"), item: "house" } },
        { column: 0, row: 3, cell: makeTerrain("water") },
      ]),
      random: { next: () => 0.99 },
    });
    const yields = cellYields(game.state);
    expect(amounts(yields, 0, 0)).toEqual(["wood:" + CONFIG.sawmillWood]);
    expect(amounts(yields, 1, 0)).toEqual(["food:" + CONFIG.hunterFood]);
    expect(amounts(yields, 2, 0)).toEqual(["food:" + CONFIG.boatFood]);
    expect(amounts(yields, 3, 0)).toEqual(["food:" + CONFIG.fieldFood]);
    expect(amounts(yields, 4, 0)).toEqual([]);
    expect(amounts(yields, 0, 3)).toEqual(["water:" + CONFIG.waterPerHouse]);
  });

  test("a dry or winter field yields nothing, rain still adds food", () => {
    const cells = board([
      { column: 0, row: 0, cell: { ...makeTerrain("earth"), item: "field" } },
    ]);
    const dry = new Game({ cells: cells, random: { next: () => 0.99 } });
    expect(cellYields(dry.state)).toEqual([]);

    const winter = new Game({
      cells: cells,
      turn: 48,
      random: { next: () => 0.99 },
    });
    expect(cellYields(winter.state)).toEqual([]);

    const rainy = new Game({
      cells: cells,
      turn: 48,
      random: { next: () => 0.99 },
    });
    rainy.state.cloud = {
      column: 0,
      row: 0,
      turnsLeft: 2,
      driftColumn: 1,
      driftRow: 0,
    };
    expect(cellYields(rainy.state)).toEqual([
      { column: 0, row: 0, resource: "food", amount: CONFIG.rainFieldFood },
    ]);
  });

  test("a burning sawmill yields nothing unless the cloud will put it out", () => {
    const cells = board([
      {
        column: 1,
        row: 1,
        cell: { ...makeTerrain("forest"), forestWood: 4, item: "sawmill", fireAge: 1 },
      },
    ]);
    const burning = new Game({ cells: cells, random: { next: () => 0.99 } });
    expect(cellYields(burning.state)).toEqual([]);

    burning.state.cloud = {
      column: 0,
      row: 0,
      turnsLeft: 2,
      driftColumn: 1,
      driftRow: 0,
    };
    expect(cellYields(burning.state)).toEqual([
      { column: 1, row: 1, resource: "wood", amount: CONFIG.sawmillWood },
    ]);
  });
});