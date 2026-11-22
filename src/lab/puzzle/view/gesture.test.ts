import { isDragGesture, TAP_DRAG_THRESHOLD_PX } from "./gesture";

describe("isDragGesture", () => {
  test("a short movement stays a tap", () => {
    expect(isDragGesture(0, 0)).toBe(false);
    expect(isDragGesture(TAP_DRAG_THRESHOLD_PX - 1, 0)).toBe(false);
  });

  test("movement at the threshold starts a drag", () => {
    expect(isDragGesture(TAP_DRAG_THRESHOLD_PX, 0)).toBe(true);
    expect(isDragGesture(6, 8)).toBe(true);
  });
});
