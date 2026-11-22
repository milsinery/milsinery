export interface Cell {
  column: number;
  row: number;
}

export type Terrain = "earth" | "forest" | "water";

export type ItemKind = "house" | "sawmill" | "hunter" | "boat" | "field";

export type ToolKind = "dig" | "fill" | "chop";

export type CardId = ItemKind | ToolKind;

export type SeasonName = "spring" | "summer" | "autumn" | "winter";

export type PhaseName = "day" | "night";

export type TopicId =
  | "wood"
  | "food"
  | "water"
  | "residents"
  | "balance"
  | "season"
  | "sun"
  | "moon"
  | "rain"
  | "fire"
  | "time";

export interface CellData {
  terrain: Terrain;
  forestWood: number;
  forestFood: number;
  item: ItemKind | null;
  /** 0 means not burning. */
  fireAge: number;
}

export interface Cloud {
  column: number;
  row: number;
  turnsLeft: number;
  driftColumn: number;
  driftRow: number;
}

export interface Resources {
  wood: number;
  food: number;
  water: number;
  residents: number;
  hunger: number;
  balance: number;
}

export interface Deltas {
  wood: number;
  food: number;
  water: number;
  residents: number;
  balance: number;
}

export type Outcome = "playing" | "lost" | "ended";

export interface GameState {
  cells: CellData[];
  resources: Resources;
  /** Completed actions. The column and season shown are for this index. */
  turn: number;
  length: number;
  cloud: Cloud | null;
  lastDeltas: Deltas;
  outcome: Outcome;
}

export type InfoTarget =
  | { kind: "cell"; cell: Cell }
  | { kind: "item"; cell: Cell; item: ItemKind }
  | { kind: "card"; card: CardId }
  | { kind: "topic"; topic: TopicId };

export type GameEvent =
  | { type: "cellTapped"; cell: Cell }
  | { type: "objectTapped"; item: ItemKind; cell: Cell }
  | { type: "trayTapped"; card: CardId }
  | { type: "topicTapped"; topic: TopicId }
  | { type: "actionRejected"; reason: string }
  | { type: "actionAccepted"; card: CardId; cell: Cell; via: "item" | "tool" }
  | { type: "residentDied" }
  | { type: "seasonChanged"; season: SeasonName }
  | { type: "fireChanged" }
  | { type: "gameLost" }
  | { type: "gameEnded" }
  | { type: "turnResolved" };

export type GameListener = (event: GameEvent) => void;

export interface RandomSource {
  next(): number;
}
