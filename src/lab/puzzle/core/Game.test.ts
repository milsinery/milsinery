import { CONFIG } from "./config";
import { Game } from "./Game";
import { makeTerrain } from "./board";
import { celestialOf, seasonOf } from "./time";
import { CellData, RandomSource, Resources } from "./types";

const calm: RandomSource = { next: () => 0.99 };
const always: RandomSource = { next: () => 0 };

function resources(partial: Partial<Resources>): Resources {
  return {
    wood: 10,
    food: 10,
    water: 10,
    residents: 1,
    hunger: 0,
    balance: 0,
    ...partial,
  };
}

function fill(cell: CellData): CellData[] {
  const cells: CellData[] = [];
  const total = CONFIG.boardSize * CONFIG.boardSize;
  for (let index = 0; index < total; index++) {
    cells.push({
      terrain: cell.terrain,
      forestWood: cell.forestWood,
      forestFood: cell.forestFood,
      item: cell.item,
      fireAge: cell.fireAge,
    });
  }
  return cells;
}

function put(cells: CellData[], column: number, row: number, cell: CellData): void {
  cells[row * CONFIG.boardSize + column] = cell;
}

function at(game: Game, column: number, row: number): CellData {
  return game.state.cells[row * CONFIG.boardSize + column];
}

describe("clocks and config", () => {
  test("uses the owner's starting numbers", () => {
    expect(CONFIG.boardSize).toBe(6);
    expect(CONFIG.seasonTurns).toBe(15);
    expect(CONFIG.dayColumns).toBe(6);
    expect(CONFIG.nightColumns).toBe(6);
    expect(CONFIG.gameLengths).toEqual([60, 120, 500]);
  });

  test("day, night and seasons run on separate clocks", () => {
    expect(celestialOf(0)).toEqual({ phase: "day", column: 0 });
    expect(celestialOf(5)).toEqual({ phase: "day", column: 5 });
    expect(celestialOf(6)).toEqual({ phase: "night", column: 0 });
    expect(celestialOf(11)).toEqual({ phase: "night", column: 5 });
    expect(celestialOf(12)).toEqual({ phase: "day", column: 0 });
    expect(seasonOf(0)).toBe("spring");
    expect(seasonOf(12)).toBe("spring");
    expect(seasonOf(14)).toBe("spring");
    expect(seasonOf(15)).toBe("summer");
    expect(seasonOf(45)).toBe("winter");
    expect(seasonOf(60)).toBe("spring");
  });
});

describe("board setup", () => {
  test("a generated board is 6 by 6 and contains every terrain plus one house", () => {
    for (let seed = 1; seed <= 8; seed++) {
      const game = new Game({ seed: seed });
      expect(game.state.cells.length).toBe(36);
      let earth = 0;
      let forest = 0;
      let water = 0;
      let houses = 0;
      for (let index = 0; index < game.state.cells.length; index++) {
        const cell = game.state.cells[index];
        if (cell.terrain === "earth") earth += 1;
        if (cell.terrain === "forest") forest += 1;
        if (cell.terrain === "water") water += 1;
        if (cell.item === "house") houses += 1;
      }
      expect(earth).toBeGreaterThan(0);
      expect(forest).toBeGreaterThan(0);
      expect(water).toBeGreaterThan(0);
      expect(houses).toBe(1);
      expect(game.state.resources.wood).toBe(4);
      expect(game.state.resources.residents).toBe(2);
      expect(game.state.length).toBe(60);
    }
  });
});

describe("actions", () => {
  test("a house costs wood, adds residents, and only fits on earth", () => {
    const cells = fill(makeTerrain("earth"));
    const game = new Game({
      cells: cells,
      random: calm,
      resources: resources({ wood: 4, residents: 2, food: 20, water: 20 }),
    });
    game.play("house", { column: 1, row: 1 });
    expect(at(game, 1, 1).item).toBe("house");
    expect(game.state.resources.wood).toBe(2);
    expect(game.state.resources.residents).toBe(4);
    expect(game.state.turn).toBe(1);

    const waterBoard = fill(makeTerrain("water"));
    const refused = new Game({
      cells: waterBoard,
      random: calm,
      resources: resources({ wood: 4 }),
    });
    const before = refused.state;
    expect(refused.play("house", { column: 0, row: 0 })[0].type).toBe("actionRejected");
    expect(refused.state).toBe(before);
  });

  test("an unaffordable drop does not spend the turn", () => {
    const game = new Game({
      cells: fill(makeTerrain("earth")),
      random: always,
      resources: resources({ wood: 1 }),
    });
    game.play("house", { column: 0, row: 0 });
    expect(game.state.turn).toBe(0);
    expect(game.state.resources.wood).toBe(1);
    expect(game.state.cloud).toBeNull();
  });

  test("tools only change an empty cell of the right terrain", () => {
    const cells = fill(makeTerrain("earth"));
    put(cells, 0, 0, makeTerrain("water"));
    put(cells, 1, 0, makeTerrain("forest"));
    put(cells, 2, 0, { ...makeTerrain("earth"), item: "house" });
    const game = new Game({
      cells: cells,
      random: calm,
      resources: resources({ wood: 3, food: 10, water: 10 }),
    });

    game.play("dig", { column: 3, row: 0 });
    expect(at(game, 3, 0).terrain).toBe("water");

    game.play("fill", { column: 0, row: 0 });
    expect(at(game, 0, 0).terrain).toBe("earth");

    const woodBefore = game.state.resources.wood;
    game.play("chop", { column: 1, row: 0 });
    expect(at(game, 1, 0).terrain).toBe("earth");
    expect(game.state.resources.wood).toBe(woodBefore + CONFIG.chopWood);

    const turn = game.state.turn;
    expect(game.play("dig", { column: 2, row: 0 })[0].type).toBe("actionRejected");
    expect(game.state.turn).toBe(turn);
  });

  test("a sawmill harvests wood and removes the forest at zero stock", () => {
    const cells = fill(makeTerrain("earth"));
    put(cells, 3, 1, { ...makeTerrain("forest"), forestWood: 1, forestFood: 4 });
    const game = new Game({
      cells: cells,
      random: calm,
      resources: resources({ wood: 5 }),
    });
    game.play("sawmill", { column: 3, row: 1 });
    expect(at(game, 3, 1).terrain).toBe("earth");
    expect(at(game, 3, 1).item).toBeNull();
    expect(game.state.resources.wood).toBe(5);
  });

  test("a hunter drains food stock and leaves the forest standing", () => {
    const cells = fill(makeTerrain("earth"));
    put(cells, 3, 1, { ...makeTerrain("forest"), forestWood: 4, forestFood: 1 });
    const game = new Game({
      cells: cells,
      random: calm,
      resources: resources({ wood: 5, food: 5 }),
    });
    game.play("hunter", { column: 3, row: 1 });
    expect(at(game, 3, 1).terrain).toBe("forest");
    expect(at(game, 3, 1).item).toBe("hunter");
    expect(at(game, 3, 1).forestFood).toBe(0);
    expect(game.state.resources.food).toBe(4);
  });
});

describe("production, hunger, spoilage", () => {
  test("a boat feeds, a field needs water, and winter fields give nothing", () => {
    const springCells = fill(makeTerrain("earth"));
    put(springCells, 1, 0, makeTerrain("water"));
    put(springCells, 0, 0, { ...makeTerrain("water"), item: "boat" });
    const spring = new Game({
      cells: springCells,
      random: calm,
      resources: resources({ food: 2, wood: 1 }),
    });
    spring.play("dig", { column: 3, row: 3 });
    expect(spring.state.resources.food).toBe(2 + CONFIG.boatFood - 1);

    const fieldCells = fill(makeTerrain("earth"));
    put(fieldCells, 1, 0, makeTerrain("water"));
    put(fieldCells, 0, 0, { ...makeTerrain("earth"), item: "field" });
    const summerSide = new Game({
      cells: fieldCells,
      random: calm,
      resources: resources({ food: 2 }),
    });
    summerSide.play("dig", { column: 3, row: 3 });
    expect(summerSide.state.resources.food).toBe(2);

    const dryCells = fill(makeTerrain("earth"));
    put(dryCells, 0, 0, { ...makeTerrain("earth"), item: "field" });
    const dry = new Game({
      cells: dryCells,
      random: calm,
      resources: resources({ food: 2 }),
    });
    dry.play("dig", { column: 3, row: 3 });
    expect(dry.state.resources.food).toBe(1);

    const winter = new Game({
      cells: fieldCells,
      random: calm,
      turn: 48,
      resources: resources({ food: 2 }),
    });
    winter.play("dig", { column: 3, row: 3 });
    expect(winter.state.resources.food).toBe(1);
  });

  test("only orthogonally adjacent water next to a house produces water", () => {
    const near = fill(makeTerrain("earth"));
    put(near, 0, 0, { ...makeTerrain("earth"), item: "house" });
    put(near, 1, 0, makeTerrain("water"));
    put(near, 0, 1, makeTerrain("water"));
    const fed = new Game({
      cells: near,
      random: calm,
      resources: resources({ water: 10 }),
    });
    fed.play("dig", { column: 3, row: 3 });
    expect(fed.state.resources.water).toBe(10 + 2 - 1);

    const diagonal = fill(makeTerrain("earth"));
    put(diagonal, 0, 0, { ...makeTerrain("earth"), item: "house" });
    put(diagonal, 1, 1, makeTerrain("water"));
    const missed = new Game({
      cells: diagonal,
      random: calm,
      resources: resources({ water: 10 }),
    });
    missed.play("dig", { column: 3, row: 3 });
    expect(missed.state.resources.water).toBe(9);
  });

  test("three short turns kill one resident, and the last death loses the game", () => {
    const cells = fill(makeTerrain("earth"));
    const game = new Game({
      cells: cells,
      random: calm,
      resources: resources({ food: 0, water: 0, residents: 1, hunger: 2 }),
    });
    const events = game.play("dig", { column: 1, row: 1 });
    const types = events.map((event) => event.type);
    expect(types).toContain("residentDied");
    expect(types).toContain("gameLost");
    expect(game.state.resources.residents).toBe(0);
    expect(game.state.outcome).toBe("lost");
    expect(game.play("dig", { column: 2, row: 2 })[0].type).toBe("actionRejected");
  });

  test("food above the cap spoils by one", () => {
    const game = new Game({
      cells: fill(makeTerrain("earth")),
      random: calm,
      resources: resources({ food: 6, water: 10, residents: 1 }),
    });
    game.play("dig", { column: 0, row: 0 });
    expect(game.state.resources.food).toBe(4);
  });
});

describe("sun, rain and fire", () => {
  test("spring sun restores a forest, winter and night do not", () => {
    const cells = fill(makeTerrain("earth"));
    put(cells, 0, 0, { ...makeTerrain("forest"), forestWood: 3, forestFood: 3 });
    const spring = new Game({
      cells: cells,
      random: calm,
      resources: resources({}),
    });
    spring.play("dig", { column: 2, row: 2 });
    expect(at(spring, 0, 0).forestWood).toBe(5);
    expect(at(spring, 0, 0).forestFood).toBe(5);

    const besideWater = fill(makeTerrain("earth"));
    put(besideWater, 0, 0, { ...makeTerrain("forest"), forestWood: 3, forestFood: 3 });
    put(besideWater, 1, 0, makeTerrain("water"));
    const boosted = new Game({
      cells: besideWater,
      random: calm,
      resources: resources({}),
    });
    boosted.play("dig", { column: 2, row: 2 });
    expect(at(boosted, 0, 0).forestWood).toBe(CONFIG.forestWoodStock);

    const winterCells = fill(makeTerrain("earth"));
    put(winterCells, 0, 0, { ...makeTerrain("forest"), forestWood: 3, forestFood: 3 });
    const winter = new Game({
      cells: winterCells,
      random: calm,
      turn: 48,
      resources: resources({}),
    });
    winter.play("dig", { column: 2, row: 2 });
    expect(at(winter, 0, 0).forestWood).toBe(3);

    const night = new Game({
      cells: cells,
      random: calm,
      turn: 6,
      resources: resources({}),
    });
    night.play("dig", { column: 2, row: 2 });
    expect(at(night, 0, 0).forestWood).toBe(3);
  });

  test("rain feeds a field under the cloud and puts out a fire", () => {
    const cells = fill(makeTerrain("earth"));
    put(cells, 0, 0, { ...makeTerrain("earth"), item: "field" });
    const rainy = new Game({
      cells: cells,
      random: always,
      resources: resources({ food: 2, water: 10 }),
    });
    rainy.play("dig", { column: 4, row: 4 });
    expect(rainy.state.resources.food).toBe(2);
    expect(rainy.state.cloud).not.toBeNull();

    const burning = fill(makeTerrain("earth"));
    put(burning, 0, 0, { ...makeTerrain("forest"), fireAge: 1 });
    put(burning, 2, 0, makeTerrain("forest"));
    const quenched = new Game({
      cells: burning,
      random: always,
      resources: resources({}),
    });
    quenched.play("dig", { column: 4, row: 4 });
    expect(at(quenched, 0, 0).fireAge).toBe(0);
    expect(at(quenched, 0, 0).terrain).toBe("forest");
    expect(at(quenched, 2, 0).fireAge).toBe(0);
  });

  test("fire spreads and then burns the cell down to earth", () => {
    const cells = fill(makeTerrain("earth"));
    put(cells, 1, 1, { ...makeTerrain("forest"), fireAge: 1 });
    put(cells, 2, 1, makeTerrain("forest"));
    // First roll is the rain check. The next roll is the first spread.
    let call = 0;
    const rolls: RandomSource = {
      next: () => {
        call += 1;
        if (call === 1) return 0.99;
        if (call === 2) return 0;
        return 0.99;
      },
    };
    const burning = new Game({
      cells: cells,
      random: rolls,
      resources: resources({}),
    });
    burning.play("dig", { column: 5, row: 5 });
    expect(at(burning, 2, 1).fireAge).toBe(1);
    expect(at(burning, 1, 1).terrain).toBe("forest");

    const old = fill(makeTerrain("earth"));
    put(old, 1, 1, { ...makeTerrain("forest"), fireAge: CONFIG.fireBurnTurns });
    const dying = new Game({
      cells: old,
      random: calm,
      resources: resources({}),
    });
    dying.play("dig", { column: 5, row: 5 });
    expect(at(dying, 1, 1).terrain).toBe("earth");
    expect(at(dying, 1, 1).fireAge).toBe(0);
  });

  test("crossing 15 turns changes the season without waiting for the day cycle", () => {
    const game = new Game({
      cells: fill(makeTerrain("earth")),
      random: calm,
      turn: 14,
      resources: resources({}),
    });
    const events = game.play("dig", { column: 0, row: 0 });
    expect(events.map((event) => event.type)).toContain("seasonChanged");
    expect(seasonOf(game.state.turn)).toBe("summer");
    expect(celestialOf(game.state.turn).column).toBe(3);
  });
});

describe("balance and the end of the game", () => {
  test("balance stays inside its range", () => {
    const rich = new Game({
      cells: fill(makeTerrain("earth")),
      random: calm,
      resources: resources({ balance: CONFIG.balanceMax, food: 10, water: 10 }),
    });
    rich.play("dig", { column: 0, row: 0 });
    expect(rich.state.resources.balance).toBe(CONFIG.balanceMax);

    const poor = new Game({
      cells: fill(makeTerrain("earth")),
      random: calm,
      resources: resources({
        balance: CONFIG.balanceMin,
        food: 0,
        water: 0,
        hunger: 0,
      }),
    });
    poor.play("dig", { column: 0, row: 0 });
    expect(poor.state.resources.balance).toBe(CONFIG.balanceMin);
  });

  test("the game ends after the chosen number of turns", () => {
    const game = new Game({
      cells: fill(makeTerrain("earth")),
      random: calm,
      length: 60,
      turn: 59,
      resources: resources({}),
    });
    const events = game.play("dig", { column: 0, row: 0 });
    expect(events.map((event) => event.type)).toContain("gameEnded");
    expect(game.state.outcome).toBe("ended");
    expect(game.state.turn).toBe(60);
  });

  test("tapping an occupied cell reports the object, not the cell", () => {
    const cells = fill(makeTerrain("earth"));
    put(cells, 2, 2, { ...makeTerrain("earth"), item: "house" });
    const game = new Game({ cells: cells, random: calm });
    expect(game.tapCell({ column: 2, row: 2 })).toEqual([
      {
        type: "objectTapped",
        item: "house",
        cell: { column: 2, row: 2 },
      },
    ]);
    expect(game.tapCell({ column: 0, row: 0 })[0].type).toBe("cellTapped");
  });
});
