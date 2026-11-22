import { GameEvent } from "../core";
import { hapticForEvent, soundForEvent } from "./cues";

describe("sound and haptic cues", () => {
  test("places, tools, rejects, fire, death and seasons each have a cue", () => {
    const placed: GameEvent = {
      type: "actionAccepted",
      card: "house",
      cell: { column: 0, row: 0 },
      via: "item",
    };
    const tool: GameEvent = {
      type: "actionAccepted",
      card: "dig",
      cell: { column: 1, row: 0 },
      via: "tool",
    };
    expect(soundForEvent(placed)).toBe("place");
    expect(soundForEvent(tool)).toBe("tool");
    expect(soundForEvent({ type: "actionRejected", reason: "cost" })).toBe("reject");
    expect(soundForEvent({ type: "fireChanged" })).toBe("fire");
    expect(soundForEvent({ type: "residentDied" })).toBe("death");
    expect(soundForEvent({ type: "seasonChanged", season: "summer" })).toBe("season");
    expect(soundForEvent({ type: "cellTapped", cell: { column: 0, row: 0 } })).toBe("tap");
    expect(hapticForEvent(placed)).toBe(20);
    expect(hapticForEvent({ type: "turnResolved" })).toBe(0);
  });
});