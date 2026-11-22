import { cellAtClientPoint, liftedGhostTopLeft, LIFT_GAP_PX } from "./geometry";

const board = { left: 10, top: 20, width: 70, height: 90 };

describe("cellAtClientPoint", () => {
  test("maps a contact point to a cell", () => {
    expect(cellAtClientPoint(board, 10, 20, 10, 7, 9)).toEqual({
      column: 0,
      row: 0,
    });
    expect(cellAtClientPoint(board, 19.9, 20, 10, 7, 9)).toEqual({
      column: 0,
      row: 0,
    });
    expect(cellAtClientPoint(board, 20, 20, 10, 7, 9)).toEqual({
      column: 1,
      row: 0,
    });
    expect(cellAtClientPoint(board, 79, 109, 10, 7, 9)).toEqual({
      column: 6,
      row: 8,
    });
  });

  test("ignores points outside the board", () => {
    expect(cellAtClientPoint(board, 9, 20, 10, 7, 9)).toBeNull();
    expect(cellAtClientPoint(board, 80, 20, 10, 7, 9)).toBeNull();
    expect(cellAtClientPoint(board, 10, 110, 10, 7, 9)).toBeNull();
  });

  test("ignores a zero cell size", () => {
    expect(cellAtClientPoint(board, 15, 25, 0, 7, 9)).toBeNull();
  });
});

describe("liftedGhostTopLeft", () => {
  test("keeps the piece above the contact point", () => {
    const point = liftedGhostTopLeft(100, 200, 40);
    expect(point.x + 20).toBe(100);
    expect(point.y + 40).toBe(200 - LIFT_GAP_PX);
    expect(200 - (point.y + 40)).toBe(LIFT_GAP_PX);
  });
});
