export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type PopoverSide = "top" | "bottom" | "left" | "right";

export type PopoverPlacement =
  | { mode: "anchor"; side: PopoverSide; top: number; left: number }
  | { mode: "sheet" };

const SIDE_ORDER: PopoverSide[] = ["bottom", "top", "right", "left"];

/**
 * Prefer a popover beside the anchor. If no side can hold the card
 * inside `bounds` (already inset for safe area), use a centered sheet.
 * The card is never scaled down to squeeze in beside the cell.
 */
export function placePopover(input: {
  anchor: Rect;
  popover: { width: number; height: number };
  bounds: Rect;
  gap: number;
}): PopoverPlacement {
  const popover = input.popover;
  const bounds = input.bounds;
  if (popover.width <= 0 || popover.height <= 0) {
    return { mode: "sheet" };
  }
  if (bounds.width <= 0 || bounds.height <= 0) {
    return { mode: "sheet" };
  }

  for (let index = 0; index < SIDE_ORDER.length; index++) {
    const side = SIDE_ORDER[index];
    const placed = placeOnSide(
      side,
      input.anchor,
      popover,
      bounds,
      input.gap
    );
    if (placed !== null) {
      return {
        mode: "anchor",
        side: side,
        top: placed.top,
        left: placed.left,
      };
    }
  }
  return { mode: "sheet" };
}

function placeOnSide(
  side: PopoverSide,
  anchor: Rect,
  popover: { width: number; height: number },
  bounds: Rect,
  gap: number
): { top: number; left: number } | null {
  const minLeft = bounds.x;
  const maxLeft = bounds.x + bounds.width - popover.width;
  const minTop = bounds.y;
  const maxTop = bounds.y + bounds.height - popover.height;
  if (maxLeft < minLeft || maxTop < minTop) {
    return null;
  }

  let top = 0;
  let left = 0;
  if (side === "bottom") {
    top = anchor.y + anchor.height + gap;
    left = anchor.x + anchor.width / 2 - popover.width / 2;
  } else if (side === "top") {
    top = anchor.y - gap - popover.height;
    left = anchor.x + anchor.width / 2 - popover.width / 2;
  } else if (side === "right") {
    left = anchor.x + anchor.width + gap;
    top = anchor.y + anchor.height / 2 - popover.height / 2;
  } else {
    left = anchor.x - gap - popover.width;
    top = anchor.y + anchor.height / 2 - popover.height / 2;
  }

  if (side === "bottom" || side === "top") {
    if (top < bounds.y || top + popover.height > bounds.y + bounds.height) {
      return null;
    }
    if (left < minLeft) {
      left = minLeft;
    }
    if (left > maxLeft) {
      left = maxLeft;
    }
  } else {
    if (left < bounds.x || left + popover.width > bounds.x + bounds.width) {
      return null;
    }
    if (top < minTop) {
      top = minTop;
    }
    if (top > maxTop) {
      top = maxTop;
    }
  }

  return { top: top, left: left };
}
