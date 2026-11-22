import {
  CSSProperties,
  PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { GameAudio } from "../audio/GameAudio";
import { hapticForEvent, PICKUP_HAPTIC_MS, soundForEvent } from "../audio/cues";
import {
  CARD_ICON,
  CARD_LABEL,
  CardId,
  Cell,
  celestialOf,
  CONFIG,
  CellYield,
  cellYields,
  describe,
  seasonOf,
  endLines,
  Game,
  InfoTarget,
  RESOURCE_ICON,
  SEASON_LABEL,
  TEXT,
  TopicId,
} from "../core";
import { Board } from "./Board";
import { cellAtClientPoint, liftedGhostTopLeft } from "./geometry";
import { isDragGesture } from "./gesture";
import { Popover } from "./Popover";
import { Rect } from "./placement";
import "./puzzle.css";

const CELL_TARGET_PX = 44;
const SKY_PX = 44;
const CARDS: CardId[] = [
  "house",
  "sawmill",
  "hunter",
  "boat",
  "field",
  "dig",
  "fill",
  "chop",
];

interface Point {
  x: number;
  y: number;
}

interface PendingCard {
  kind: "pending";
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
  source: "card";
  card: CardId;
  origin: Point;
  size: number;
}

interface PendingTap {
  kind: "pending";
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
  source: "tap";
  topic: TopicId | null;
  cell: Cell | null;
  anchor: Rect | null;
}

interface DraggingCard {
  kind: "dragging";
  pointerId: number;
  card: CardId;
  origin: Point;
  size: number;
  x: number;
  y: number;
  hover: Cell | null;
  allowed: boolean;
}

interface ReturningCard {
  kind: "returning";
  card: CardId;
  x: number;
  y: number;
  size: number;
  animate: boolean;
}

type Gesture = PendingCard | PendingTap | DraggingCard | ReturningCard;

interface OpenPopover {
  target: InfoTarget;
  anchor: Rect;
}

function useBalanceGame(): Game {
  const ref = useRef<Game | null>(null);
  if (ref.current === null) {
    const seed = Date.now() % 2147483647;
    ref.current = new Game({ seed: seed === 0 ? 1 : seed });
  }
  const game = ref.current;
  if (game === null) {
    throw new Error("Game was not created.");
  }
  return game;
}

function useGameAudio(): GameAudio {
  const ref = useRef<GameAudio | null>(null);
  if (ref.current === null) {
    ref.current = new GameAudio();
  }
  const audio = ref.current;
  if (audio === null) {
    throw new Error("Audio was not created.");
  }
  return audio;
}

function readSafeBounds(root: HTMLElement): Rect {
  const rect = root.getBoundingClientRect();
  const style = window.getComputedStyle(root);
  const padTop = parseFloat(style.paddingTop) || 0;
  const padRight = parseFloat(style.paddingRight) || 0;
  const padBottom = parseFloat(style.paddingBottom) || 0;
  const padLeft = parseFloat(style.paddingLeft) || 0;
  const margin = 8;
  return {
    x: rect.left + padLeft + margin,
    y: rect.top + padTop + margin,
    width: Math.max(0, rect.width - padLeft - padRight - margin * 2),
    height: Math.max(0, rect.height - padTop - padBottom - margin * 2),
  };
}

function elementRect(element: Element): Rect {
  const box = element.getBoundingClientRect();
  return { x: box.left, y: box.top, width: box.width, height: box.height };
}

function signed(value: number): string {
  if (value > 0) {
    return "+" + value;
  }
  return String(value);
}

const PuzzlePage = () => {
  const game = useBalanceGame();
  const audio = useGameAudio();
  const rootRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<SVGSVGElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const popoverRef = useRef<OpenPopover | null>(null);
  const returnFrame = useRef<number | null>(null);
  const warned = useRef(false);

  const [boardState, setBoardState] = useState(game.state);
  const [popover, setPopoverState] = useState<OpenPopover | null>(null);
  const [gesture, setGestureState] = useState<Gesture | null>(null);
  const [muted, setMuted] = useState(false);
  const [landscape, setLandscape] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth >= window.innerHeight;
  });
  const [cellSize, setCellSize] = useState(0);

  const setGesture = useCallback((next: Gesture | null) => {
    gestureRef.current = next;
    setGestureState(next);
  }, []);

  const setPopover = useCallback((next: OpenPopover | null) => {
    popoverRef.current = next;
    setPopoverState(next);
  }, []);

  useEffect(() => {
    const onEvent = (event: Parameters<typeof soundForEvent>[0]) => {
      const sound = soundForEvent(event);
      if (sound !== null) {
        audio.play(sound);
      }
      const pattern = hapticForEvent(event);
      if (typeof pattern === "number") {
        if (pattern > 0) {
          audio.haptic(pattern);
        }
      } else {
        audio.haptic(pattern);
      }
      setBoardState(game.state);
    };
    game.addListener(onEvent);
    return () => {
      game.removeListener(onEvent);
    };
  }, [game, audio]);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    meta.setAttribute("data-puzzle-robots", "true");
    document.head.appendChild(meta);
    const viewport = document.querySelector('meta[name="viewport"]');
    const previous = viewport === null ? null : viewport.getAttribute("content");
    if (viewport !== null) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1"
      );
    }
    const previousTitle = document.title;
    document.title = TEXT.title;
    return () => {
      meta.remove();
      if (viewport !== null && previous !== null) {
        viewport.setAttribute("content", previous);
      }
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPopover(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPopover]);

  useEffect(() => {
    const root = rootRef.current;
    if (root === null) {
      return undefined;
    }
    const block = (event: TouchEvent) => {
      event.preventDefault();
    };
    root.addEventListener("touchmove", block, { passive: false });
    return () => root.removeEventListener("touchmove", block);
  }, []);

  useEffect(() => {
    return () => {
      if (returnFrame.current !== null) {
        window.cancelAnimationFrame(returnFrame.current);
      }
    };
  }, []);

  useEffect(() => {
    if (cellSize > 0 && cellSize < CELL_TARGET_PX && warned.current === false) {
      warned.current = true;
      console.warn(
        "Puzzle cell is " +
          cellSize.toFixed(1) +
          "px, below the 44pt target. Rendering anyway."
      );
    }
  }, [cellSize]);

  useEffect(() => {
    if (gesture === null || gesture.kind !== "returning" || gesture.animate === false) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      const current = gestureRef.current;
      if (current !== null && current.kind === "returning") {
        setGesture(null);
      }
    }, 240);
    return () => window.clearTimeout(timer);
  }, [gesture, setGesture]);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const slot = slotRef.current;
    if (root === null || slot === null) {
      return undefined;
    }
    const measure = () => {
      const rootRect = root.getBoundingClientRect();
      if (rootRect.width > 0 && rootRect.height > 0) {
        setLandscape(rootRect.width >= rootRect.height);
      }
      const slotRect = slot.getBoundingClientRect();
      const raw = Math.min(
        slotRect.width / CONFIG.boardSize,
        (slotRect.height - SKY_PX) / CONFIG.boardSize
      );
      if (raw > 0 && Number.isFinite(raw)) {
        setCellSize(Math.floor(raw * 100) / 100);
      }
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(root);
    observer.observe(slot);
    return () => observer.disconnect();
  }, []);

  function beginReturn(current: DraggingCard) {
    if (returnFrame.current !== null) {
      window.cancelAnimationFrame(returnFrame.current);
    }
    setGesture({
      kind: "returning",
      card: current.card,
      x: current.x,
      y: current.y,
      size: current.size,
      animate: false,
    });
    returnFrame.current = window.requestAnimationFrame(() => {
      returnFrame.current = null;
      setGesture({
        kind: "returning",
        card: current.card,
        x: current.origin.x,
        y: current.origin.y,
        size: current.size,
        animate: true,
      });
    });
  }

  function openInfo(target: InfoTarget, anchor: Rect) {
    setPopover({ target: target, anchor: anchor });
  }

  function cellAnchor(cell: Cell): Rect | null {
    const board = boardRef.current;
    if (board === null || cellSize <= 0) {
      return null;
    }
    const rect = board.getBoundingClientRect();
    return {
      x: rect.left + cell.column * cellSize,
      y: rect.top + cell.row * cellSize,
      width: cellSize,
      height: cellSize,
    };
  }

  function hoverAt(clientX: number, clientY: number, card: CardId): { cell: Cell | null; allowed: boolean } {
    const board = boardRef.current;
    if (board === null || cellSize <= 0) {
      return { cell: null, allowed: false };
    }
    const cell = cellAtClientPoint(
      board.getBoundingClientRect(),
      clientX,
      clientY,
      cellSize,
      CONFIG.boardSize,
      CONFIG.boardSize
    );
    if (cell === null) {
      return { cell: null, allowed: false };
    }
    return { cell: cell, allowed: game.preview(card, cell).allowed };
  }

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    audio.unlock();
    const target = event.target;
    if (!(target instanceof Element)) {
      return;
    }
    if (target.closest("[data-popover-root]") !== null) {
      return;
    }
    if (target.closest("[data-no-gesture]") !== null) {
      return;
    }
    const cardNode = target.closest("[data-card]");
    if (cardNode instanceof HTMLElement) {
      const card = cardNode.getAttribute("data-card");
      if (card === null) {
        return;
      }
      const rect = cardNode.getBoundingClientRect();
      setGesture({
        kind: "pending",
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        source: "card",
        card: card as CardId,
        origin: { x: rect.left, y: rect.top },
        size: Math.max(rect.width, 44),
      });
      capture(event);
      return;
    }
    const topicNode = target.closest("[data-topic]");
    if (topicNode instanceof HTMLElement) {
      setGesture({
        kind: "pending",
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
        source: "tap",
        topic: topicNode.getAttribute("data-topic") as TopicId,
        cell: null,
        anchor: elementRect(topicNode),
      });
      capture(event);
      return;
    }
    const board = boardRef.current;
    if (board !== null && cellSize > 0) {
      const cell = cellAtClientPoint(
        board.getBoundingClientRect(),
        event.clientX,
        event.clientY,
        cellSize,
        CONFIG.boardSize,
        CONFIG.boardSize
      );
      if (cell !== null) {
        setGesture({
          kind: "pending",
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          moved: false,
          source: "tap",
          topic: null,
          cell: cell,
          anchor: null,
        });
        capture(event);
        return;
      }
    }
    if (popoverRef.current !== null) {
      setPopover(null);
    }
  }

  function capture(event: ReactPointerEvent<HTMLElement>) {
    const root = rootRef.current;
    if (root !== null) {
      root.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
  }

  function onPointerMove(event: ReactPointerEvent<HTMLElement>) {
    const current = gestureRef.current;
    if (current === null || current.kind === "returning") {
      return;
    }
    if (current.pointerId !== event.pointerId) {
      return;
    }
    if (current.kind === "pending") {
      const deltaX = event.clientX - current.startX;
      const deltaY = event.clientY - current.startY;
      if (isDragGesture(deltaX, deltaY) === false) {
        return;
      }
      if (current.source === "tap") {
        setGesture({ ...current, moved: true });
        return;
      }
      setPopover(null);
      audio.play("pickup");
      audio.haptic(PICKUP_HAPTIC_MS);
      const point = liftedGhostTopLeft(event.clientX, event.clientY, current.size);
      const hover = hoverAt(event.clientX, event.clientY, current.card);
      setGesture({
        kind: "dragging",
        pointerId: current.pointerId,
        card: current.card,
        origin: current.origin,
        size: current.size,
        x: point.x,
        y: point.y,
        hover: hover.cell,
        allowed: hover.allowed,
      });
      return;
    }
    const point = liftedGhostTopLeft(event.clientX, event.clientY, current.size);
    const hover = hoverAt(event.clientX, event.clientY, current.card);
    setGesture({
      kind: "dragging",
      pointerId: current.pointerId,
      card: current.card,
      origin: current.origin,
      size: current.size,
      x: point.x,
      y: point.y,
      hover: hover.cell,
      allowed: hover.allowed,
    });
  }

  function onPointerUp(event: ReactPointerEvent<HTMLElement>) {
    const current = gestureRef.current;
    if (current === null || current.kind === "returning") {
      return;
    }
    if (current.pointerId !== event.pointerId) {
      return;
    }
    if (current.kind === "pending") {
      if (current.moved) {
        setGesture(null);
        return;
      }
      if (current.source === "card") {
        const node = event.target instanceof Element ? event.target.closest("[data-card]") : null;
        const anchor =
          node instanceof Element
            ? elementRect(node)
            : {
                x: current.origin.x,
                y: current.origin.y,
                width: current.size,
                height: current.size,
              };
        openInfo({ kind: "card", card: current.card }, anchor);
        game.tapCard(current.card);
        setGesture(null);
        return;
      }
      if (current.topic !== null && current.anchor !== null) {
        openInfo({ kind: "topic", topic: current.topic }, current.anchor);
        game.tapTopic(current.topic);
        setGesture(null);
        return;
      }
      if (current.cell !== null) {
        const anchor = cellAnchor(current.cell);
        const events = game.tapCell(current.cell);
        if (anchor !== null && events.length > 0) {
          const first = events[0];
          if (first.type === "objectTapped") {
            openInfo(
              { kind: "item", item: first.item, cell: first.cell },
              anchor
            );
          } else if (first.type === "cellTapped") {
            openInfo({ kind: "cell", cell: first.cell }, anchor);
          }
        }
      }
      setGesture(null);
      return;
    }
    if (current.hover === null) {
      audio.play("reject");
      audio.haptic([14, 30, 18]);
      beginReturn(current);
      return;
    }
    const events = game.play(current.card, current.hover);
    const accepted = events.length > 0 && events[0].type === "actionAccepted";
    if (accepted) {
      setGesture(null);
      return;
    }
    beginReturn(current);
  }

  function onPointerCancel(event: ReactPointerEvent<HTMLElement>) {
    const current = gestureRef.current;
    if (current === null || current.kind === "returning") {
      return;
    }
    if (current.pointerId !== event.pointerId) {
      return;
    }
    if (current.kind === "dragging") {
      beginReturn(current);
      return;
    }
    setGesture(null);
  }

  function refresh() {
    setBoardState(game.state);
    setPopover(null);
    setGesture(null);
  }

  const sky = celestialOf(boardState.turn);
  const night = sky.phase === "night";
  const season = SEASON_LABEL[seasonOf(boardState.turn)];
  const balanceSpan = CONFIG.balanceMax - CONFIG.balanceMin;
  const balancePercent =
    ((boardState.resources.balance - CONFIG.balanceMin) / balanceSpan) * 100;
  const hasFire = boardHasFire(boardState);
  const cellVariable = (cellSize > 0 ? cellSize : 48) + "px";
  const pageStyle = { "--cell": cellVariable } as CSSProperties;
  const draggedCard =
    gesture !== null && (gesture.kind === "dragging" || gesture.kind === "returning")
      ? gesture.card
      : gesture !== null && gesture.kind === "pending" && gesture.source === "card" && gesture.moved
      ? gesture.card
      : null;

  let popoverNode = null;
  if (popover !== null && rootRef.current !== null) {
    const description = describe(boardState, popover.target);
    popoverNode = (
      <Popover
        key={popoverKey(popover.target)}
        description={{ title: description.title, lines: description.lines, actions: [] }}
        anchor={popover.anchor}
        bounds={readSafeBounds(rootRef.current)}
        onAction={() => undefined}
        onDismiss={() => setPopover(null)}
      />
    );
  }

  const ghost =
    gesture !== null && (gesture.kind === "dragging" || gesture.kind === "returning")
      ? gesture
      : null;

  return (
    <main
      ref={rootRef}
      className={
        "puzzle " +
        (landscape ? "puzzle--landscape" : "puzzle--portrait") +
        (night ? " puzzle--night" : "")
      }
      data-layout={landscape ? "landscape" : "portrait"}
      data-phase={sky.phase}
      data-cloud={boardState.cloud === null ? "0" : "1"}
      data-turn={boardState.turn}
      data-testid="puzzle-root"
      style={pageStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onContextMenu={(event) => event.preventDefault()}
    >
      <h1 className="visually-hidden" tabIndex={-1}>
        {TEXT.title}
      </h1>
      <div className="puzzle__balance-block">
        <button
          type="button"
          className="puzzle__balance"
          data-topic="balance"
          aria-label={
            TEXT.balance +
            " " +
            boardState.resources.balance +
            ", " +
            TEXT.balanceLeft +
            ", " +
            TEXT.balanceRight
          }
        >
          <span className="puzzle__balance-track" aria-hidden="true">
            <span className="puzzle__balance-mark" style={{ left: balancePercent + "%" }} />
          </span>
          <span className="puzzle__balance-sides">
            <span>{TEXT.balanceLeft}</span>
            <span>{TEXT.balanceRight}</span>
          </span>
        </button>
      </div>
      <div className="puzzle__stage">
      <header className="puzzle__hud">
        <div className="puzzle__resources">
          <Stat
            topic="wood"
            icon={RESOURCE_ICON.wood}
            label={TEXT.wood}
            value={boardState.resources.wood}
            delta={boardState.lastDeltas.wood}
          />
          <Stat
            topic="food"
            icon={RESOURCE_ICON.food}
            label={TEXT.food}
            value={boardState.resources.food}
            delta={boardState.lastDeltas.food}
          />
          <Stat
            topic="water"
            icon={RESOURCE_ICON.water}
            label={TEXT.water}
            value={boardState.resources.water}
            delta={boardState.lastDeltas.water}
          />
          <Stat
            topic="residents"
            icon={RESOURCE_ICON.residents}
            label={TEXT.residents}
            value={boardState.resources.residents}
            delta={boardState.lastDeltas.residents}
          />
        </div>
        <div className="puzzle__meta">
          <button type="button" className="puzzle__turn" data-topic="time">
            {TEXT.turn} {boardState.turn + (boardState.outcome === "playing" ? 1 : 0)}/{boardState.length}
          </button>
          <button type="button" className="puzzle__season" data-topic="season">
            {season}
          </button>
          <span className="puzzle__meta-end">
            {hasFire && (
              <button type="button" className="puzzle__text-button" data-topic="fire">
                🔥
              </button>
            )}
            {CONFIG.gameLengths.map((length) => (
              <button
                key={length}
                type="button"
                className="puzzle__length"
                data-no-gesture="true"
                aria-pressed={boardState.length === length}
                onClick={() => {
                  game.setLength(length);
                  refresh();
                }}
              >
                {length}
              </button>
            ))}
          </span>
        </div>
      </header>

      <div className="puzzle__board-slot" ref={slotRef}>
        {cellSize > 0 && (
          <div className="puzzle__stack" style={{ width: cellSize * CONFIG.boardSize }}>
            <div className="puzzle__sky">
              <button
                type="button"
                className="puzzle__luminary"
                data-topic={sky.phase === "day" ? "sun" : "moon"}
                style={{
                  width: cellSize,
                  transform: "translateX(" + sky.column * cellSize + "px)",
                }}
              >
                {sky.phase === "day" ? "☀️" : "🌙"}
              </button>
            </div>
            <div className="puzzle__board-wrap">
              <Board
                state={boardState}
                cellSize={cellSize}
                hover={
                  gesture !== null && gesture.kind === "dragging" && gesture.hover !== null
                    ? { cell: gesture.hover, allowed: gesture.allowed }
                    : null
                }
                anchorCell={anchorCellOf(popover)}
                boardRef={boardRef}
              />
              <YieldLayer cellSize={cellSize} yields={cellYields(boardState)} />
              {boardState.cloud !== null && (
                <Rain
                  cellSize={cellSize}
                  column={boardState.cloud.column}
                  row={boardState.cloud.row}
                />
              )}
              {boardState.cloud !== null && (
                <button
                  type="button"
                  className="puzzle__cloud-tap"
                  data-topic="rain"
                  style={{
                    left: boardState.cloud.column * cellSize,
                    top: boardState.cloud.row * cellSize,
                  }}
                >
                  ☁️
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <aside className="puzzle__panel">
        <p className="puzzle__tray-label">{TEXT.tray}</p>
        <div className="puzzle__tray" aria-label={TEXT.tray}>
          {CARDS.map((card) => (
            <button
              key={card}
              type="button"
              className={"puzzle__card" + (draggedCard === card ? " is-dragged" : "")}
              data-card={card}
            >
              <span className="puzzle__card-icon">{CARD_ICON[card]}</span>
              <span className="puzzle__card-name">{CARD_LABEL[card]}</span>
            </button>
          ))}
        </div>
        <div className="puzzle__controls" data-no-gesture="true">
          <button
            type="button"
            onClick={() => {
              game.restart();
              refresh();
            }}
          >
            {TEXT.restart}
          </button>
          <button
            type="button"
            aria-pressed={muted}
            onClick={() => {
              audio.unlock();
              audio.muted = audio.muted === false;
              setMuted(audio.muted);
            }}
          >
            {muted ? TEXT.unmute : TEXT.mute}
          </button>
        </div>
      </aside>
      </div>

      {popoverNode}
      {ghost !== null && (
        <div
          className="puzzle__ghost"
          data-dragging="true"
          onTransitionEnd={(event) => {
            if (event.propertyName !== "transform") {
              return;
            }
            const current = gestureRef.current;
            if (current !== null && current.kind === "returning") {
              setGesture(null);
            }
          }}
          style={{
            width: ghost.size,
            height: ghost.size,
            transform: "translate3d(" + ghost.x + "px, " + ghost.y + "px, 0)",
            transition:
              ghost.kind === "returning" && ghost.animate ? "transform 160ms ease-out" : "none",
          }}
        >
          <span>{CARD_ICON[ghost.card]}</span>
        </div>
      )}
      {boardState.outcome !== "playing" && (
        <div className="puzzle__end" data-no-gesture="true">
          <div className="puzzle__end-card">
            <h2>{boardState.outcome === "lost" ? TEXT.lossTitle : TEXT.endTitle}</h2>
            {endLines(boardState).map((line) => (
              <p key={line}>{line}</p>
            ))}
            <button
              type="button"
              onClick={() => {
                game.restart();
                refresh();
              }}
            >
              {TEXT.again}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

function Stat(props: {
  topic: TopicId;
  icon: string;
  label: string;
  value: number;
  delta: number;
}) {
  return (
    <button
      type="button"
      className="puzzle__stat"
      data-topic={props.topic}
      aria-label={props.label + " " + props.value + " " + signed(props.delta)}
    >
      <span className="puzzle__stat-icon" aria-hidden="true">
        {props.icon}
      </span>
      <span className="puzzle__stat-value">{props.value}</span>
      <Delta value={props.delta} />
    </button>
  );
}

function Delta(props: { value: number }) {
  if (props.value === 0) {
    return null;
  }
  const up = props.value > 0;
  return (
    <span className={"puzzle__delta " + (up ? "puzzle__delta--up" : "puzzle__delta--down")}>
      <span
        className={"puzzle__arrow " + (up ? "puzzle__arrow--up" : "puzzle__arrow--down")}
        aria-hidden="true"
      >
        {up ? "▲" : "▼"}
      </span>
      {Math.abs(props.value)}
    </span>
  );
}

function YieldLayer(props: { cellSize: number; yields: CellYield[] }) {
  const groups: CellYield[][] = [];
  for (let index = 0; index < props.yields.length; index++) {
    const item = props.yields[index];
    let group: CellYield[] | null = null;
    for (let groupIndex = 0; groupIndex < groups.length; groupIndex++) {
      const existing = groups[groupIndex];
      if (existing[0].column === item.column && existing[0].row === item.row) {
        group = existing;
        break;
      }
    }
    if (group === null) {
      group = [];
      groups.push(group);
    }
    group.push(item);
  }
  return (
    <div className="puzzle__yields" aria-hidden="true">
      {groups.map((group) =>
        group.map((item, index) => (
          <span
            key={item.column + "-" + item.row + "-" + item.resource}
            className="puzzle__yield"
            data-yield={item.column + "," + item.row}
            style={{
              left: item.column * props.cellSize + 2,
              top: (item.row + 1) * props.cellSize - 16 - index * 14,
            }}
          >
            <span>{RESOURCE_ICON[item.resource]}</span>
            <Delta value={item.amount} />
          </span>
        ))
      )}
    </div>
  );
}

function Rain(props: { cellSize: number; column: number; row: number }) {
  const drops = [];
  const count = 18;
  for (let index = 0; index < count; index++) {
    drops.push(
      <span
        key={index}
        className="puzzle__drop"
        style={{
          left: (index * 19) % 92 + "%",
          animationDelay: index * 0.11 + "s",
          animationDuration: 0.75 + (index % 4) * 0.12 + "s",
        }}
      />
    );
  }
  return (
    <div
      className="puzzle__rain"
      data-rain="true"
      style={{
        left: props.column * props.cellSize,
        top: props.row * props.cellSize,
        width: props.cellSize * CONFIG.cloudSize,
        height: props.cellSize * CONFIG.cloudSize,
      }}
    >
      {drops}
    </div>
  );
}

function boardHasFire(state: { cells: Array<{ fireAge: number }> }): boolean {
  for (let index = 0; index < state.cells.length; index++) {
    if (state.cells[index].fireAge > 0) {
      return true;
    }
  }
  return false;
}

function anchorCellOf(popover: OpenPopover | null): Cell | null {
  if (popover === null) {
    return null;
  }
  if (popover.target.kind === "cell" || popover.target.kind === "item") {
    return popover.target.cell;
  }
  return null;
}

function popoverKey(target: InfoTarget): string {
  if (target.kind === "cell") {
    return "cell-" + target.cell.column + "-" + target.cell.row;
  }
  if (target.kind === "item") {
    return "item-" + target.item + "-" + target.cell.column + "-" + target.cell.row;
  }
  if (target.kind === "card") {
    return "card-" + target.card;
  }
  return "topic-" + target.topic;
}

export default PuzzlePage;
