import { createSandboxGame, describeTarget, TRAY_DROPS_ENABLED } from "./sandbox";

describe("sandbox content", () => {
  test("starts as a 7 by 9 board with tray drops enabled", () => {
    const game = createSandboxGame();
    expect(game.state.grid.width).toBe(7);
    expect(game.state.grid.height).toBe(9);
    expect(game.trayDropsEnabled).toBe(TRAY_DROPS_ENABLED);
    expect(game.state.pieceAt({ column: 1, row: 2 })!.label).toBe("A");
    expect(game.state.trayPieces().length).toBeGreaterThan(0);
  });

  test("popover copy names the target and does not change the board", () => {
    const game = createSandboxGame();
    const cell = describeTarget(game.state, {
      kind: "cell",
      cell: { column: 0, row: 1 },
    });
    expect(cell.title).toBe("Cell");
    expect(cell.lines).toContain("column 0, row 1");
    expect(cell.actions.map((action) => action.id)).toEqual([
      "action-a",
      "action-b",
    ]);

    const object = describeTarget(game.state, {
      kind: "object",
      objectId: "b",
      cell: { column: 3, row: 4 },
    });
    expect(object.title).toBe("B");
    expect(object.lines).toContain("square");
    expect(object.lines).toContain("column 3, row 4");
  });
});
