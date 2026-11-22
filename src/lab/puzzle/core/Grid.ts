import { Cell } from "./types";

/** Width and height are counts of cells. Defaults match the sandbox board. */
export class Grid {
  readonly width: number;
  readonly height: number;

  constructor(width: number = 7, height: number = 9) {
    if (width < 1 || height < 1) {
      throw new Error("Grid size must be at least 1 by 1.");
    }
    this.width = width;
    this.height = height;
  }

  contains(cell: Cell): boolean {
    if (cell.column < 0 || cell.row < 0) {
      return false;
    }
    if (cell.column >= this.width || cell.row >= this.height) {
      return false;
    }
    return true;
  }
}
