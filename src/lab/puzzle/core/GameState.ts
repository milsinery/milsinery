import { Grid } from "./Grid";
import {
  Cell,
  cellsEqual,
  copyCell,
  Piece,
  Placement,
} from "./types";

/**
 * Immutable snapshot. Commands on Game replace the whole state
 * instead of editing this object in place.
 */
export class GameState {
  readonly grid: Grid;
  readonly pieces: ReadonlyArray<Piece>;
  readonly placements: ReadonlyArray<Placement>;
  readonly selectedPieceId: string | null;

  constructor(
    grid: Grid,
    pieces: ReadonlyArray<Piece>,
    placements: ReadonlyArray<Placement>,
    selectedPieceId: string | null
  ) {
    this.grid = grid;
    this.pieces = pieces;
    this.placements = placements;
    this.selectedPieceId = selectedPieceId;
  }

  pieceById(id: string): Piece | null {
    for (let index = 0; index < this.pieces.length; index++) {
      if (this.pieces[index].id === id) {
        return this.pieces[index];
      }
    }
    return null;
  }

  pieceAt(cell: Cell): Piece | null {
    const placement = this.placementAt(cell);
    if (placement === null) {
      return null;
    }
    return this.pieceById(placement.pieceId);
  }

  placementAt(cell: Cell): Placement | null {
    for (let index = 0; index < this.placements.length; index++) {
      if (cellsEqual(this.placements[index].cell, cell)) {
        return this.placements[index];
      }
    }
    return null;
  }

  cellOf(pieceId: string): Cell | null {
    for (let index = 0; index < this.placements.length; index++) {
      if (this.placements[index].pieceId === pieceId) {
        return this.placements[index].cell;
      }
    }
    return null;
  }

  /** Pieces with no cell. Order follows the piece list. */
  trayPieces(): Piece[] {
    const tray: Piece[] = [];
    for (let index = 0; index < this.pieces.length; index++) {
      const piece = this.pieces[index];
      if (this.cellOf(piece.id) === null) {
        tray.push(piece);
      }
    }
    return tray;
  }

  clone(): GameState {
    return new GameState(
      this.grid,
      this.pieces,
      copyPlacements(this.placements),
      this.selectedPieceId
    );
  }

  withSelection(pieceId: string | null): GameState {
    return new GameState(this.grid, this.pieces, this.placements, pieceId);
  }

  withPlacements(placements: ReadonlyArray<Placement>): GameState {
    return new GameState(
      this.grid,
      this.pieces,
      placements,
      this.selectedPieceId
    );
  }
}

export function copyPlacements(
  placements: ReadonlyArray<Placement>
): Placement[] {
  const copy: Placement[] = [];
  for (let index = 0; index < placements.length; index++) {
    const placement = placements[index];
    copy.push({
      pieceId: placement.pieceId,
      cell: copyCell(placement.cell),
    });
  }
  return copy;
}
