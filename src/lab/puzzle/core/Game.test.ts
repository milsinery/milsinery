import { Game, GameConfig } from "./Game";
import { Grid } from "./Grid";
import { GameEvent } from "./types";
import { allowAnyEmptyCell, ValidityHook } from "./validity";

function testConfig(overrides: Partial<GameConfig> = {}): GameConfig {
  return {
    width: 3,
    height: 3,
    trayDropsEnabled: true,
    pieces: [
      { id: "a", shape: "circle", colorToken: "ink", label: "A" },
      { id: "b", shape: "square", colorToken: "clay", label: "B" },
      { id: "c", shape: "triangle", colorToken: "moss", label: "C" },
    ],
    placements: [
      { pieceId: "a", cell: { column: 0, row: 0 } },
      { pieceId: "b", cell: { column: 1, row: 1 } },
    ],
    ...overrides,
  };
}

function typesOf(events: GameEvent[]): string[] {
  const names: string[] = [];
  for (let index = 0; index < events.length; index++) {
    names.push(events[index].type);
  }
  return names;
}

describe("Grid", () => {
  test("defaults to 7 by 9 cells", () => {
    const grid = new Grid();
    expect(grid.width).toBe(7);
    expect(grid.height).toBe(9);
    expect(grid.contains({ column: 6, row: 8 })).toBe(true);
    expect(grid.contains({ column: 7, row: 0 })).toBe(false);
    expect(grid.contains({ column: 0, row: -1 })).toBe(false);
  });

  test("rejects a zero size", () => {
    expect(() => new Grid(0, 4)).toThrow();
  });
});

describe("Game tap", () => {
  test("an empty cell emits only cellTapped", () => {
    const game = new Game(testConfig());
    const heard: GameEvent[] = [];
    game.addListener((event) => heard.push(event));

    const events = game.tap({ column: 2, row: 2 });

    expect(typesOf(events)).toEqual(["cellTapped"]);
    expect(events[0]).toEqual({
      type: "cellTapped",
      cell: { column: 2, row: 2 },
    });
    expect(heard).toEqual(events);
  });

  test("an occupied cell emits objectTapped and not cellTapped", () => {
    const game = new Game(testConfig());
    const events = game.tap({ column: 0, row: 0 });

    expect(events).toEqual([
      {
        type: "objectTapped",
        objectId: "a",
        cell: { column: 0, row: 0 },
      },
    ]);
  });

  test("a tap outside the grid emits nothing", () => {
    const game = new Game(testConfig());
    expect(game.tap({ column: 3, row: 0 })).toEqual([]);
  });
});

describe("Game moves", () => {
  test("moves a piece onto an empty cell", () => {
    const game = new Game(testConfig());
    const before = game.state;

    const events = game.movePiece(
      { column: 0, row: 0 },
      { column: 2, row: 1 }
    );

    expect(events).toEqual([
      {
        type: "piecePlaced",
        pieceId: "a",
        cell: { column: 2, row: 1 },
      },
    ]);
    expect(before.cellOf("a")).toEqual({ column: 0, row: 0 });
    expect(game.state).not.toBe(before);
    expect(game.state.cellOf("a")).toEqual({ column: 2, row: 1 });
    expect(game.state.pieceAt({ column: 0, row: 0 })).toBeNull();
  });

  test("rejects a move onto an occupied cell and leaves state", () => {
    const game = new Game(testConfig());
    const before = game.state;

    const events = game.movePiece(
      { column: 0, row: 0 },
      { column: 1, row: 1 }
    );

    expect(events[0]).toEqual({
      type: "moveRejected",
      pieceId: "a",
      cell: { column: 1, row: 1 },
      reason: "occupied",
    });
    expect(game.state).toBe(before);
  });

  test("rejects a move from an empty cell", () => {
    const game = new Game(testConfig());
    const events = game.movePiece(
      { column: 2, row: 2 },
      { column: 2, row: 1 }
    );
    expect(events[0]).toMatchObject({
      type: "moveRejected",
      reason: "empty",
    });
  });

  test("dropping on the same cell does not emit and does not move", () => {
    const game = new Game(testConfig());
    const before = game.state;
    expect(
      game.movePiece({ column: 0, row: 0 }, { column: 0, row: 0 })
    ).toEqual([]);
    expect(game.state).toBe(before);
  });

  test("a custom validity hook can refuse an empty cell", () => {
    const hook: ValidityHook = (state, pieceId, to) => {
      if (to.column === 2) {
        return { allowed: false, reason: "blocked-column" };
      }
      return allowAnyEmptyCell(state, pieceId, to);
    };
    const game = new Game(testConfig({ validity: hook }));

    const events = game.movePiece(
      { column: 0, row: 0 },
      { column: 2, row: 2 }
    );

    expect(events[0]).toMatchObject({
      type: "moveRejected",
      reason: "blocked-column",
    });
    expect(game.state.cellOf("a")).toEqual({ column: 0, row: 0 });
  });

  test("rejects a destination outside the grid", () => {
    const game = new Game(testConfig());
    const events = game.movePiece(
      { column: 0, row: 0 },
      { column: 5, row: 0 }
    );
    expect(events[0]).toMatchObject({
      type: "moveRejected",
      reason: "outside",
    });
  });
});

describe("tray drops", () => {
  test("places a tray piece onto an empty cell", () => {
    const game = new Game(testConfig());
    expect(game.state.trayPieces().map((piece) => piece.id)).toEqual(["c"]);

    const events = game.placeFromTray("c", { column: 2, row: 0 });

    expect(events[0]).toEqual({
      type: "piecePlaced",
      pieceId: "c",
      cell: { column: 2, row: 0 },
    });
    expect(game.state.cellOf("c")).toEqual({ column: 2, row: 0 });
    expect(game.state.trayPieces()).toEqual([]);
  });

  test("a disabled tray refuses before the validity hook", () => {
    const hook: ValidityHook = () => {
      throw new Error("hook should not run");
    };
    const game = new Game(
      testConfig({ trayDropsEnabled: false, validity: hook })
    );

    const events = game.placeFromTray("c", { column: 2, row: 0 });

    expect(events[0]).toMatchObject({
      type: "moveRejected",
      pieceId: "c",
      reason: "tray-disabled",
    });
    expect(game.state.cellOf("c")).toBeNull();
  });

  test("setTrayDropsEnabled turns drops off without rebuilding", () => {
    const game = new Game(testConfig());
    game.setTrayDropsEnabled(false);
    expect(game.trayDropsEnabled).toBe(false);
    expect(game.placeFromTray("c", { column: 2, row: 2 })[0]).toMatchObject({
      reason: "tray-disabled",
    });
  });

  test("cannot tray-drop a piece that is already on the board", () => {
    const game = new Game(testConfig());
    expect(game.placeFromTray("a", { column: 2, row: 2 })[0]).toMatchObject({
      reason: "not-in-tray",
    });
  });

  test("tray drop onto an occupied cell is rejected", () => {
    const game = new Game(testConfig());
    expect(game.placeFromTray("c", { column: 0, row: 0 })[0]).toMatchObject({
      reason: "occupied",
    });
    expect(game.state.pieceAt({ column: 0, row: 0 })!.id).toBe("a");
  });
});

describe("actions, selection, reset", () => {
  test("chooseAction emits actionChosen and does not change the board", () => {
    const game = new Game(testConfig());
    const before = game.state;
    const target = {
      kind: "object" as const,
      objectId: "b",
      cell: { column: 1, row: 1 },
    };

    const events = game.chooseAction("action-a", target);

    expect(events).toEqual([
      { type: "actionChosen", actionId: "action-a", target: target },
    ]);
    expect(game.state).toBe(before);
  });

  test("selectPiece emits pieceSelected and ignores unknown ids", () => {
    const game = new Game(testConfig());
    expect(game.selectPiece("missing")).toEqual([]);
    expect(game.state.selectedPieceId).toBeNull();

    const events = game.selectPiece("b");
    expect(events).toEqual([{ type: "pieceSelected", pieceId: "b" }]);
    expect(game.state.selectedPieceId).toBe("b");
  });

  test("reset restores the initial placements and selection", () => {
    const game = new Game(testConfig());
    game.selectPiece("a");
    game.movePiece({ column: 0, row: 0 }, { column: 2, row: 2 });
    game.placeFromTray("c", { column: 2, row: 0 });

    game.reset();

    expect(game.state.cellOf("a")).toEqual({ column: 0, row: 0 });
    expect(game.state.cellOf("c")).toBeNull();
    expect(game.state.selectedPieceId).toBeNull();
  });

  test("a removed listener no longer receives events", () => {
    const game = new Game(testConfig());
    const heard: GameEvent[] = [];
    const listener = (event: GameEvent) => heard.push(event);
    game.addListener(listener);
    game.removeListener(listener);
    game.tap({ column: 2, row: 2 });
    expect(heard).toEqual([]);
  });

  test("the default board is 7 by 9 when size is omitted", () => {
    const config = testConfig();
    delete config.width;
    delete config.height;
    const game = new Game(config);
    expect(game.state.grid.width).toBe(7);
    expect(game.state.grid.height).toBe(9);
  });
});

describe("invalid setups", () => {
  test("rejects duplicate piece ids", () => {
    const config = testConfig();
    config.pieces = [
      { id: "a", shape: "circle", colorToken: "ink", label: "A" },
      { id: "a", shape: "square", colorToken: "clay", label: "B" },
    ];
    config.placements = [];
    expect(() => new Game(config)).toThrow(/Duplicate piece id/);
  });
});
