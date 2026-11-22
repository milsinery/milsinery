import { copyPlacements, GameState } from "./GameState";
import { Grid } from "./Grid";
import {
  ActionTarget,
  Cell,
  cellsEqual,
  copyCell,
  GameEvent,
  GameListener,
  Piece,
  Placement,
  Validity,
} from "./types";
import { allowAnyEmptyCell, ValidityHook } from "./validity";

export interface GameConfig {
  width?: number;
  height?: number;
  pieces: Piece[];
  placements: Placement[];
  /**
   * When false, placeFromTray refuses and the view should not start
   * a tray drag. Board moves are unchanged.
   */
  trayDropsEnabled: boolean;
  validity?: ValidityHook;
}

/**
 * Command API. Each method returns the events it emitted.
 * Listeners see the same events, after state has been replaced.
 */
export class Game {
  private listeners: GameListener[];
  private initial: GameState;
  private current: GameState;
  private validity: ValidityHook;
  private trayDrops: boolean;

  constructor(config: GameConfig) {
    this.listeners = [];
    this.trayDrops = config.trayDropsEnabled;
    if (config.validity !== undefined) {
      this.validity = config.validity;
    } else {
      this.validity = allowAnyEmptyCell;
    }
    this.initial = buildInitial(config);
    this.current = this.initial.clone();
  }

  get state(): GameState {
    return this.current;
  }

  get trayDropsEnabled(): boolean {
    return this.trayDrops;
  }

  setTrayDropsEnabled(enabled: boolean): void {
    this.trayDrops = enabled;
  }

  addListener(listener: GameListener): void {
    this.listeners.push(listener);
  }

  removeListener(listener: GameListener): void {
    const next: GameListener[] = [];
    for (let index = 0; index < this.listeners.length; index++) {
      if (this.listeners[index] !== listener) {
        next.push(this.listeners[index]);
      }
    }
    this.listeners = next;
  }

  selectPiece(pieceId: string): GameEvent[] {
    if (this.current.pieceById(pieceId) === null) {
      return [];
    }
    this.current = this.current.withSelection(pieceId);
    return this.emit({ type: "pieceSelected", pieceId: pieceId });
  }

  /**
   * Raw tap on a board cell. An occupying piece wins:
   * objectTapped instead of cellTapped. The view does not decide.
   */
  tap(cell: Cell): GameEvent[] {
    if (this.current.grid.contains(cell) === false) {
      return [];
    }
    const piece = this.current.pieceAt(cell);
    if (piece !== null) {
      return this.emit({
        type: "objectTapped",
        objectId: piece.id,
        cell: copyCell(cell),
      });
    }
    return this.emit({ type: "cellTapped", cell: copyCell(cell) });
  }

  /** Drag from one occupied cell to another. Same cell is a no-op. */
  movePiece(from: Cell, to: Cell): GameEvent[] {
    const piece = this.current.pieceAt(from);
    if (piece === null) {
      return this.emit({
        type: "moveRejected",
        pieceId: "",
        cell: copyCell(to),
        reason: "empty",
      });
    }
    if (cellsEqual(from, to)) {
      return [];
    }
    const check = this.validity(this.current, piece.id, to);
    if (check.allowed === false) {
      return this.emit({
        type: "moveRejected",
        pieceId: piece.id,
        cell: copyCell(to),
        reason: check.reason,
      });
    }
    const placements = replacePlacement(this.current.placements, piece.id, to);
    this.current = this.current.withPlacements(placements);
    return this.emit({
      type: "piecePlaced",
      pieceId: piece.id,
      cell: copyCell(to),
    });
  }

  /**
   * Drag from the tray onto a cell. Refused outright when
   * trayDropsEnabled is false, before the validity hook runs.
   */
  placeFromTray(pieceId: string, to: Cell): GameEvent[] {
    if (this.trayDrops === false) {
      return this.emit({
        type: "moveRejected",
        pieceId: pieceId,
        cell: copyCell(to),
        reason: "tray-disabled",
      });
    }
    const piece = this.current.pieceById(pieceId);
    if (piece === null) {
      return this.emit({
        type: "moveRejected",
        pieceId: pieceId,
        cell: copyCell(to),
        reason: "missing",
      });
    }
    if (this.current.cellOf(pieceId) !== null) {
      return this.emit({
        type: "moveRejected",
        pieceId: pieceId,
        cell: copyCell(to),
        reason: "not-in-tray",
      });
    }
    const check = this.validity(this.current, pieceId, to);
    if (check.allowed === false) {
      return this.emit({
        type: "moveRejected",
        pieceId: pieceId,
        cell: copyCell(to),
        reason: check.reason,
      });
    }
    const placements = copyPlacements(this.current.placements);
    placements.push({ pieceId: pieceId, cell: copyCell(to) });
    this.current = this.current.withPlacements(placements);
    return this.emit({
      type: "piecePlaced",
      pieceId: pieceId,
      cell: copyCell(to),
    });
  }

  /** Records a popover button. Does not change the board. */
  chooseAction(actionId: string, target: ActionTarget): GameEvent[] {
    return this.emit({
      type: "actionChosen",
      actionId: actionId,
      target: copyTarget(target),
    });
  }

  /** Same hook as movePiece. No events. */
  evaluateMove(from: Cell, to: Cell): Validity {
    const piece = this.current.pieceAt(from);
    if (piece === null) {
      return { allowed: false, reason: "empty" };
    }
    if (cellsEqual(from, to)) {
      return { allowed: true };
    }
    return this.validity(this.current, piece.id, to);
  }

  evaluateTrayDrop(pieceId: string, to: Cell): Validity {
    if (this.trayDrops === false) {
      return { allowed: false, reason: "tray-disabled" };
    }
    if (this.current.pieceById(pieceId) === null) {
      return { allowed: false, reason: "missing" };
    }
    if (this.current.cellOf(pieceId) !== null) {
      return { allowed: false, reason: "not-in-tray" };
    }
    return this.validity(this.current, pieceId, to);
  }

  reset(): void {
    this.current = this.initial.clone();
  }

  private emit(event: GameEvent): GameEvent[] {
    for (let index = 0; index < this.listeners.length; index++) {
      this.listeners[index](event);
    }
    return [event];
  }
}

function buildInitial(config: GameConfig): GameState {
  const width = config.width !== undefined ? config.width : 7;
  const height = config.height !== undefined ? config.height : 9;
  const grid = new Grid(width, height);

  const pieces: Piece[] = [];
  const seenIds: string[] = [];
  for (let index = 0; index < config.pieces.length; index++) {
    const piece = config.pieces[index];
    if (seenIds.indexOf(piece.id) !== -1) {
      throw new Error("Duplicate piece id: " + piece.id);
    }
    seenIds.push(piece.id);
    pieces.push({
      id: piece.id,
      shape: piece.shape,
      colorToken: piece.colorToken,
      label: piece.label,
    });
  }

  const placements: Placement[] = [];
  const occupied: string[] = [];
  const placedIds: string[] = [];
  for (let index = 0; index < config.placements.length; index++) {
    const placement = config.placements[index];
    if (seenIds.indexOf(placement.pieceId) === -1) {
      throw new Error("Placement for missing piece: " + placement.pieceId);
    }
    if (placedIds.indexOf(placement.pieceId) !== -1) {
      throw new Error("Piece placed twice: " + placement.pieceId);
    }
    if (grid.contains(placement.cell) === false) {
      throw new Error("Placement is outside the grid.");
    }
    const key = placement.cell.column + "," + placement.cell.row;
    if (occupied.indexOf(key) !== -1) {
      throw new Error("Two pieces cannot start on the same cell.");
    }
    placedIds.push(placement.pieceId);
    occupied.push(key);
    placements.push({
      pieceId: placement.pieceId,
      cell: copyCell(placement.cell),
    });
  }

  return new GameState(grid, pieces, placements, null);
}

function replacePlacement(
  placements: ReadonlyArray<Placement>,
  pieceId: string,
  to: Cell
): Placement[] {
  const next: Placement[] = [];
  for (let index = 0; index < placements.length; index++) {
    const placement = placements[index];
    if (placement.pieceId === pieceId) {
      next.push({ pieceId: pieceId, cell: copyCell(to) });
    } else {
      next.push({
        pieceId: placement.pieceId,
        cell: copyCell(placement.cell),
      });
    }
  }
  return next;
}

function copyTarget(target: ActionTarget): ActionTarget {
  if (target.kind === "cell") {
    return { kind: "cell", cell: copyCell(target.cell) };
  }
  return {
    kind: "object",
    objectId: target.objectId,
    cell: copyCell(target.cell),
  };
}
