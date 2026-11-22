import { Game } from "./core";
import {
  PopoverContentSource,
  PopoverDescription,
} from "./popover";

/**
 * Tray-to-board drags are on so the gesture can be felt on a phone.
 * Set this to false to refuse them. Board drags are unaffected.
 * `Game.setTrayDropsEnabled` does the same thing at runtime.
 */
export const TRAY_DROPS_ENABLED = true;

/** Placeholder pieces only. No rules, no goals. */
export function createSandboxGame(): Game {
  return new Game({
    width: 7,
    height: 9,
    trayDropsEnabled: TRAY_DROPS_ENABLED,
    pieces: [
      { id: "a", shape: "circle", colorToken: "ink", label: "A" },
      { id: "b", shape: "square", colorToken: "clay", label: "B" },
      { id: "c", shape: "triangle", colorToken: "moss", label: "C" },
      { id: "d", shape: "diamond", colorToken: "sand", label: "D" },
      { id: "e", shape: "circle", colorToken: "sea", label: "E" },
      { id: "f", shape: "square", colorToken: "ink", label: "F" },
    ],
    placements: [
      { pieceId: "a", cell: { column: 1, row: 2 } },
      { pieceId: "b", cell: { column: 3, row: 4 } },
      { pieceId: "c", cell: { column: 5, row: 6 } },
    ],
  });
}

/**
 * Plug real copy in here later. Buttons only emit `actionChosen`;
 * they do not change the board.
 */
export const describeTarget: PopoverContentSource = (state, target) => {
  const actions = [
    { id: "action-a", label: "Action A" },
    { id: "action-b", label: "Action B" },
  ];
  if (target.kind === "cell") {
    const description: PopoverDescription = {
      title: "Cell",
      lines: [coordinateLine(target.cell.column, target.cell.row)],
      actions: actions,
    };
    return description;
  }
  const piece = state.pieceById(target.objectId);
  const title = piece !== null ? piece.label : target.objectId;
  const shape = piece !== null ? piece.shape : "object";
  return {
    title: title,
    lines: [
      shape,
      coordinateLine(target.cell.column, target.cell.row),
    ],
    actions: actions,
  };
};

function coordinateLine(column: number, row: number): string {
  return "column " + column + ", row " + row;
}
