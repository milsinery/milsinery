import {
  cellIndex,
  cloneState,
  generateBoard,
  inBounds,
  startingResources,
  zeroDeltas,
} from "./board";
import { CONFIG } from "./config";
import { createLcg } from "./random";
import { applyAction, canPlay, isTool, resolveTurn } from "./rules";
import { seasonOf } from "./time";
import {
  CardId,
  Cell,
  CellData,
  GameEvent,
  GameListener,
  GameState,
  RandomSource,
  Resources,
  TopicId,
} from "./types";

export interface GameOptions {
  seed?: number;
  length?: number;
  random?: RandomSource;
  cells?: CellData[];
  resources?: Resources;
  turn?: number;
}

export class Game {
  private listeners: GameListener[];
  private current: GameState;
  private random: RandomSource;
  private seed: number;
  private readonly ownsRandom: boolean;

  constructor(options: GameOptions = {}) {
    this.listeners = [];
    this.seed = options.seed !== undefined ? options.seed : 1;
    if (options.random !== undefined) {
      this.random = options.random;
      this.ownsRandom = false;
    } else {
      this.random = createLcg(this.seed);
      this.ownsRandom = true;
    }
    const length = allowedLength(
      options.length !== undefined ? options.length : CONFIG.gameLengths[0]
    );
    this.current = this.makeState(options, length);
  }

  get state(): GameState {
    return this.current;
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

  tapCell(cell: Cell): GameEvent[] {
    if (inBounds(cell.column, cell.row) === false) {
      return [];
    }
    const data = this.current.cells[cellIndex(cell.column, cell.row)];
    if (data.item !== null) {
      return this.emitOne({
        type: "objectTapped",
        item: data.item,
        cell: { column: cell.column, row: cell.row },
      });
    }
    return this.emitOne({
      type: "cellTapped",
      cell: { column: cell.column, row: cell.row },
    });
  }

  tapCard(card: CardId): GameEvent[] {
    return this.emitOne({ type: "trayTapped", card: card });
  }

  tapTopic(topic: TopicId): GameEvent[] {
    return this.emitOne({ type: "topicTapped", topic: topic });
  }

  /** Drag from the tray. A legal drop spends the turn. */
  play(card: CardId, cell: Cell): GameEvent[] {
    const verdict = canPlay(this.current, card, cell);
    if (verdict.ok === false) {
      return this.emitOne({ type: "actionRejected", reason: verdict.reason });
    }
    const draft = cloneState(this.current);
    const before = {
      wood: draft.resources.wood,
      food: draft.resources.food,
      water: draft.resources.water,
      residents: draft.resources.residents,
      balance: draft.resources.balance,
    };
    applyAction(draft, card, cell);
    const notes = resolveTurn(draft, this.random);
    draft.lastDeltas = {
      wood: draft.resources.wood - before.wood,
      food: draft.resources.food - before.food,
      water: draft.resources.water - before.water,
      residents: draft.resources.residents - before.residents,
      balance: draft.resources.balance - before.balance,
    };
    this.current = draft;
    const events: GameEvent[] = [
      {
        type: "actionAccepted",
        card: card,
        cell: { column: cell.column, row: cell.row },
        via: isTool(card) ? "tool" : "item",
      },
    ];
    if (notes.died) {
      events.push({ type: "residentDied" });
    }
    if (notes.seasonChanged) {
      events.push({ type: "seasonChanged", season: seasonOf(draft.turn) });
    }
    if (notes.fire) {
      events.push({ type: "fireChanged" });
    }
    if (notes.lost) {
      events.push({ type: "gameLost" });
    } else if (notes.ended) {
      events.push({ type: "gameEnded" });
    }
    events.push({ type: "turnResolved" });
    return this.emitAll(events);
  }

  preview(card: CardId, cell: Cell): { allowed: boolean } {
    const verdict = canPlay(this.current, card, cell);
    return { allowed: verdict.ok };
  }

  setLength(length: number): void {
    if (CONFIG.gameLengths.indexOf(length) === -1) {
      return;
    }
    if (
      this.current.length === length &&
      this.current.turn === 0 &&
      this.current.outcome === "playing"
    ) {
      return;
    }
    this.restart(length);
  }

  restart(length?: number): void {
    if (length !== undefined) {
      this.current.length = allowedLength(length);
    }
    const kept = this.current.length;
    if (this.ownsRandom) {
      this.seed += 1;
      this.random = createLcg(this.seed);
    }
    this.current = this.makeState({}, kept);
  }

  private makeState(options: GameOptions, length: number): GameState {
    const cells =
      options.cells !== undefined ? cloneCells(options.cells) : generateBoard(this.random);
    const resources =
      options.resources !== undefined
        ? {
            wood: options.resources.wood,
            food: options.resources.food,
            water: options.resources.water,
            residents: options.resources.residents,
            hunger: options.resources.hunger,
            balance: options.resources.balance,
          }
        : startingResources();
    return {
      cells: cells,
      resources: resources,
      turn: options.turn !== undefined ? options.turn : 0,
      length: length,
      cloud: null,
      lastDeltas: zeroDeltas(),
      outcome: "playing",
    };
  }

  private emitOne(event: GameEvent): GameEvent[] {
    return this.emitAll([event]);
  }

  private emitAll(events: GameEvent[]): GameEvent[] {
    for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
      for (let listenerIndex = 0; listenerIndex < this.listeners.length; listenerIndex++) {
        this.listeners[listenerIndex](events[eventIndex]);
      }
    }
    return events;
  }
}

function allowedLength(length: number): number {
  for (let index = 0; index < CONFIG.gameLengths.length; index++) {
    if (CONFIG.gameLengths[index] === length) {
      return length;
    }
  }
  return CONFIG.gameLengths[0];
}

function cloneCells(cells: CellData[]): CellData[] {
  const copy: CellData[] = [];
  for (let index = 0; index < cells.length; index++) {
    const cell = cells[index];
    copy.push({
      terrain: cell.terrain,
      forestWood: cell.forestWood,
      forestFood: cell.forestFood,
      item: cell.item,
      fireAge: cell.fireAge,
    });
  }
  return copy;
}

export function cellOf(state: GameState, cell: Cell): CellData {
  return state.cells[cellIndex(cell.column, cell.row)];
}
