# Puzzle sandbox

Hidden page: `/#/lab/puzzle`. It is not in the site navigation. While the page is mounted it sets `<meta name="robots" content="noindex">` and `viewport-fit=cover` on the viewport tag, and removes both changes on the way out.

This is a layout and input skeleton. There are no win conditions, turns, or puzzle rules. Placeholder pieces are in `sandbox.ts`.

## Layout

`core/` is plain TypeScript. It does not import React, the DOM, or the browser. The intention is that these types port to Swift as structs and enums, and `Game` ports as a reference type that owns a `GameState` value.

`view/` is the SpriteKit stand-in: an SVG board plus pointer input. Cell size is `min(slotWidth / columns, slotHeight / rows)`, so the whole board fits the space left after the panel. Portrait (the page box is taller than it is wide) puts the board on top and the tray underneath. Landscape puts the board in the remaining space, centered, with the panel on the side. The switch is the box aspect ratio, not a device check. Padding uses `env(safe-area-inset-*)`. If a cell comes out under 44px the board still draws, and the console gets one warning. Strokes and type scale from the cell size.

`audio/` listens to core events in the view. Core never imports it. Sounds are oscillators (no audio files). The first pointer down unlocks `AudioContext`, which iOS Safari requires. Mute silences both the tones and `navigator.vibrate`. Vibrate is a stand-in for haptics; on iOS it is missing and the call is skipped. A drag that starts plays a pickup sound from the view, because core has no pointer model.

On iOS later: core becomes Swift types, the view becomes an `SKScene` whose cell size comes from the scene size the same way, and the same events trigger `SKAction` sound plus Core Haptics. Row 0 in core is the top of the board. SpriteKit’s origin is the bottom, so `y = (rows - 1 - row) * cellSize`.

## Input

The view reports raw hits. It does not decide what a tap means.

- Movement under 10px is a tap. `game.tap(cell)` emits `objectTapped` when a piece occupies that cell, otherwise `cellTapped`.
- A drag from one cell to another calls `movePiece(from, to)`. The pluggable validity hook decides. The default, `allowAnyEmptyCell`, allows any in-bounds empty cell. Dropping on the same cell is a no-op. Dropping off the board is cancelled by the view (core is not asked).
- A drag from the tray calls `placeFromTray`. `TRAY_DROPS_ENABLED` in `sandbox.ts` (and `game.setTrayDropsEnabled`) turns that off. When it is off, the hook is not consulted.
- The dragged piece is drawn above the finger (`LIFT_GAP_PX` of air under the shape). The highlighted cell is the one under the contact point. A legal drop snaps. An illegal drop animates back.
- `selectPiece` is on `Game` for later use. The page does not use tap-to-select. Taps open the popover.

## Popover

`describeTarget` in `sandbox.ts` returns a title, lines, and actions for a cell or an object. That function is the plug-in point. Action buttons call `chooseAction`, which only emits `actionChosen(actionId, target)` and does not change the board.

The card anchors beside the tapped cell when it fits entirely inside the safe area (below, then above, then right, then left), shifting along the cell so it does not hang off the screen. If no side can hold it, the same card is a centered sheet over a dimmed board. It closes on an outside tap, Escape, the sheet backdrop, or when a drag starts. An outside tap only dismisses; it does not also hit the cell underneath.

Replace `describeTarget` when the real menu exists. On iOS the same description can feed a popover, with the sheet as the compact fallback.
