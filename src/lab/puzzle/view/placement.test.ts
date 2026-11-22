import { placePopover, Rect } from "./placement";

const gap = 8;

describe("placePopover", () => {
  test("anchors below the cell when there is room", () => {
    const placed = placePopover({
      anchor: { x: 100, y: 100, width: 50, height: 50 },
      popover: { width: 180, height: 140 },
      bounds: { x: 0, y: 0, width: 400, height: 800 },
      gap: gap,
    });
    expect(placed).toEqual({ mode: "anchor", side: "bottom", top: 158, left: 35 });
  });

  test("flips above the cell when the bottom edge is too close", () => {
    const placed = placePopover({
      anchor: { x: 100, y: 700, width: 50, height: 50 },
      popover: { width: 180, height: 140 },
      bounds: { x: 0, y: 0, width: 400, height: 800 },
      gap: gap,
    });
    expect(placed).toEqual({ mode: "anchor", side: "top", top: 552, left: 35 });
  });

  test("shifts horizontally so the card stays inside the safe bounds", () => {
    const bounds: Rect = { x: 20, y: 30, width: 300, height: 500 };
    const placed = placePopover({
      anchor: { x: 20, y: 80, width: 40, height: 40 },
      popover: { width: 120, height: 80 },
      bounds: bounds,
      gap: gap,
    });
    expect(placed).toEqual({ mode: "anchor", side: "bottom", top: 128, left: 20 });
    expect(bounds.x).toBeLessThanOrEqual(20);
    expect(20 + 120).toBeLessThanOrEqual(bounds.x + bounds.width);
  });

  test("uses the right side only when vertical sides do not fit", () => {
    const placed = placePopover({
      anchor: { x: 20, y: 40, width: 40, height: 40 },
      popover: { width: 100, height: 80 },
      bounds: { x: 0, y: 0, width: 500, height: 120 },
      gap: gap,
    });
    expect(placed).toEqual({ mode: "anchor", side: "right", top: 20, left: 68 });
  });

  test("prefers below the cell when several sides fit", () => {
    const placed = placePopover({
      anchor: { x: 300, y: 300, width: 40, height: 40 },
      popover: { width: 100, height: 80 },
      bounds: { x: 0, y: 0, width: 800, height: 800 },
      gap: gap,
    });
    expect(placed).toMatchObject({ mode: "anchor", side: "bottom" });
  });

  test("becomes a sheet when no side can hold the card", () => {
    const placed = placePopover({
      anchor: { x: 80, y: 80, width: 40, height: 40 },
      popover: { width: 180, height: 160 },
      bounds: { x: 0, y: 0, width: 200, height: 200 },
      gap: gap,
    });
    expect(placed).toEqual({ mode: "sheet" });
  });
});
