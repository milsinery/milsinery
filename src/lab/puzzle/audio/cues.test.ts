import { GameEvent } from "../core";
import { hapticForEvent, soundForEvent } from "./cues";

describe("sound and haptic cues", () => {
  const cases: Array<{ event: GameEvent; sound: string; haptic: number | number[] }> = [
    {
      event: { type: "cellTapped", cell: { column: 1, row: 2 } },
      sound: "tap",
      haptic: 10,
    },
    {
      event: {
        type: "objectTapped",
        objectId: "a",
        cell: { column: 0, row: 0 },
      },
      sound: "select",
      haptic: 12,
    },
    {
      event: { type: "pieceSelected", pieceId: "a" },
      sound: "select",
      haptic: 12,
    },
    {
      event: {
        type: "piecePlaced",
        pieceId: "a",
        cell: { column: 1, row: 1 },
      },
      sound: "place",
      haptic: 20,
    },
    {
      event: {
        type: "moveRejected",
        pieceId: "a",
        cell: { column: 1, row: 1 },
        reason: "occupied",
      },
      sound: "reject",
      haptic: [14, 30, 18],
    },
    {
      event: {
        type: "actionChosen",
        actionId: "action-a",
        target: { kind: "cell", cell: { column: 0, row: 1 } },
      },
      sound: "tap",
      haptic: 8,
    },
  ];

  test.each(cases)("$event.type maps to $sound", (entry) => {
    expect(soundForEvent(entry.event)).toBe(entry.sound);
    expect(hapticForEvent(entry.event)).toEqual(entry.haptic);
  });
});
