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
import { ActionTarget, Cell, Game, GameEvent, Piece } from "../core";
import { createSandboxGame, describeTarget } from "../sandbox";
import { Board } from "./Board";
import { cellAtClientPoint, liftedGhostTopLeft } from "./geometry";
import { isDragGesture } from "./gesture";
import { PieceShapes } from "./PieceGraphic";
import { Popover } from "./Popover";
import { Rect } from "./placement";
import "./puzzle.css";

const CELL_TARGET_PX = 44;

interface Point {
  x: number;
  y: number;
}

type GestureSource = "board" | "tray" | "empty";

interface PendingGesture {
  kind: "pending";
  pointerId: number;
  startX: number;
  startY: number;
  moved: boolean;
  pieceId: string | null;
  from: Cell | null;
  source: GestureSource;
  origin: Point;
  size: number;
}

interface DraggingGesture {
  kind: "dragging";
  pointerId: number;
  pieceId: string;
  from: Cell | null;
  source: "board" | "tray";
  origin: Point;
  size: number;
  x: number;
  y: number;
  hover: Cell | null;
  allowed: boolean;
}

interface ReturningGesture {
  kind: "returning";
  pieceId: string;
  source: "board" | "tray";
  x: number;
  y: number;
  size: number;
  animate: boolean;
}

type Gesture = PendingGesture | DraggingGesture | ReturningGesture;

function useSandboxGame(): Game {
  const ref = useRef<Game | null>(null);
  if (ref.current === null) {
    ref.current = createSandboxGame();
  }
  const game = ref.current;
  if (game === null) {
    throw new Error("Sandbox game was not created.");
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

function cellAnchor(board: SVGSVGElement, cell: Cell, cellSize: number): Rect {
  const rect = board.getBoundingClientRect();
  return {
    x: rect.left + cell.column * cellSize,
    y: rect.top + cell.row * cellSize,
    width: cellSize,
    height: cellSize,
  };
}

function targetKey(target: ActionTarget): string {
  const cell = target.cell.column + "-" + target.cell.row;
  if (target.kind === "cell") {
    return "cell-" + cell;
  }
  return "object-" + target.objectId + "-" + cell;
}

const PuzzlePage = () => {
  const game = useSandboxGame();
  const audio = useGameAudio();
  const rootRef = useRef<HTMLElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);
  const boardRef = useRef<SVGSVGElement>(null);
  const gestureRef = useRef<Gesture | null>(null);
  const popoverRef = useRef<ActionTarget | null>(null);
  const openPopoverRef = useRef<(target: ActionTarget) => void>(() => undefined);
  const closePopoverRef = useRef<() => void>(() => undefined);
  const returnFrame = useRef<number | null>(null);
  const warned = useRef(false);

  const [boardState, setBoardState] = useState(game.state);
  const [popover, setPopover] = useState<ActionTarget | null>(null);
  const [gesture, setGestureState] = useState<Gesture | null>(null);
  const [muted, setMuted] = useState(false);
  const [landscape, setLandscape] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.innerWidth >= window.innerHeight;
  });
  const [cellSize, setCellSize] = useState(0);

  const columns = boardState.grid.width;
  const rows = boardState.grid.height;

  const setGesture = useCallback((next: Gesture | null) => {
    gestureRef.current = next;
    setGestureState(next);
  }, []);

  function closePopover() {
    popoverRef.current = null;
    setPopover(null);
  }

  function openPopover(target: ActionTarget) {
    popoverRef.current = target;
    setPopover(target);
  }

  openPopoverRef.current = openPopover;
  closePopoverRef.current = closePopover;

  useEffect(() => {
    const onEvent = (event: GameEvent) => {
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
      if (event.type === "cellTapped") {
        openPopoverRef.current({ kind: "cell", cell: event.cell });
      } else if (event.type === "objectTapped") {
        openPopoverRef.current({
          kind: "object",
          objectId: event.objectId,
          cell: event.cell,
        });
      }
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
    const previous =
      viewport === null ? null : viewport.getAttribute("content");
    if (viewport !== null) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1"
      );
    }

    return () => {
      meta.remove();
      if (viewport !== null && previous !== null) {
        viewport.setAttribute("content", previous);
      }
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopoverRef.current();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

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
    if (
      gesture === null ||
      gesture.kind !== "returning" ||
      gesture.animate === false
    ) {
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
      const raw = Math.min(slotRect.width / columns, slotRect.height / rows);
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
  }, [columns, rows]);

  function hoverAt(clientX: number, clientY: number, source: "board" | "tray", pieceId: string, from: Cell | null) {
    const board = boardRef.current;
    if (board === null || cellSize <= 0) {
      return { cell: null as Cell | null, allowed: false };
    }
    const cell = cellAtClientPoint(
      board.getBoundingClientRect(),
      clientX,
      clientY,
      cellSize,
      columns,
      rows
    );
    if (cell === null) {
      return { cell: null, allowed: false };
    }
    const check =
      source === "tray"
        ? game.evaluateTrayDrop(pieceId, cell)
        : from === null
        ? { allowed: false as const }
        : game.evaluateMove(from, cell);
    return { cell: cell, allowed: check.allowed };
  }

  function beginReturn(current: DraggingGesture) {
    if (returnFrame.current !== null) {
      window.cancelAnimationFrame(returnFrame.current);
    }
    setGesture({
      kind: "returning",
      pieceId: current.pieceId,
      source: current.source,
      x: current.x,
      y: current.y,
      size: current.size,
      animate: false,
    });
    returnFrame.current = window.requestAnimationFrame(() => {
      returnFrame.current = null;
      setGesture({
        kind: "returning",
        pieceId: current.pieceId,
        source: current.source,
        x: current.origin.x,
        y: current.origin.y,
        size: current.size,
        animate: true,
      });
    });
  }

  function startPending(event: ReactPointerEvent<HTMLElement>, pending: PendingGesture) {
    setGesture(pending);
    const root = rootRef.current;
    if (root !== null) {
      root.setPointerCapture(event.pointerId);
    }
    event.preventDefault();
  }

  function onPointerDown(event: ReactPointerEvent<HTMLElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }
    audio.unlock();
    const target = event.target;
    if (target instanceof Element) {
      if (target.closest("[data-popover-root]") !== null) {
        return;
      }
      if (target.closest("[data-no-gesture]") !== null) {
        return;
      }
      const token = target.closest("[data-tray-piece]");
      if (token instanceof HTMLElement) {
        const pieceId = token.getAttribute("data-tray-piece");
        if (pieceId === null || game.trayDropsEnabled === false) {
          if (popoverRef.current !== null) {
            closePopover();
          }
          return;
        }
        const rect = token.getBoundingClientRect();
        startPending(event, {
          kind: "pending",
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          moved: false,
          pieceId: pieceId,
          from: null,
          source: "tray",
          origin: { x: rect.left, y: rect.top },
          size: cellSize > 0 ? cellSize : rect.width,
        });
        return;
      }
    }

    const board = boardRef.current;
    if (board !== null && cellSize > 0) {
      const boardRect = board.getBoundingClientRect();
      const cell = cellAtClientPoint(
        boardRect,
        event.clientX,
        event.clientY,
        cellSize,
        columns,
        rows
      );
      if (cell !== null) {
        const piece = game.state.pieceAt(cell);
        startPending(event, {
          kind: "pending",
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          moved: false,
          pieceId: piece === null ? null : piece.id,
          from: cell,
          source: piece === null ? "empty" : "board",
          origin: {
            x: boardRect.left + cell.column * cellSize,
            y: boardRect.top + cell.row * cellSize,
          },
          size: cellSize,
        });
        return;
      }
    }

    if (popoverRef.current !== null) {
      closePopover();
    }
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
      if (
        current.pieceId === null ||
        current.source === "empty" ||
        (current.source === "board" && current.from === null)
      ) {
        setGesture({
          kind: "pending",
          pointerId: current.pointerId,
          startX: current.startX,
          startY: current.startY,
          moved: true,
          pieceId: current.pieceId,
          from: current.from,
          source: current.source,
          origin: current.origin,
          size: current.size,
        });
        return;
      }
      closePopover();
      audio.play("pickup");
      audio.haptic(PICKUP_HAPTIC_MS);
      const point = liftedGhostTopLeft(event.clientX, event.clientY, current.size);
      const hover = hoverAt(
        event.clientX,
        event.clientY,
        current.source,
        current.pieceId,
        current.from
      );
      setGesture({
        kind: "dragging",
        pointerId: current.pointerId,
        pieceId: current.pieceId,
        from: current.from,
        source: current.source,
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
    const hover = hoverAt(
      event.clientX,
      event.clientY,
      current.source,
      current.pieceId,
      current.from
    );
    setGesture({
      kind: "dragging",
      pointerId: current.pointerId,
      pieceId: current.pieceId,
      from: current.from,
      source: current.source,
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
      const popoverWasOpen = popoverRef.current !== null;
      if (current.moved || popoverWasOpen) {
        if (popoverWasOpen) {
          closePopover();
        }
        setGesture(null);
        return;
      }
      if (current.source !== "tray" && current.from !== null) {
        game.tap(current.from);
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
    const events =
      current.source === "tray"
        ? game.placeFromTray(current.pieceId, current.hover)
        : current.from === null
        ? []
        : game.movePiece(current.from, current.hover);
    const placed = events.length > 0 && events[0].type === "piecePlaced";
    if (placed) {
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

  function onReset() {
    if (returnFrame.current !== null) {
      window.cancelAnimationFrame(returnFrame.current);
      returnFrame.current = null;
    }
    game.reset();
    setBoardState(game.state);
    closePopover();
    setGesture(null);
  }

  function onToggleMute() {
    audio.unlock();
    audio.muted = audio.muted === false;
    setMuted(audio.muted);
  }

  function onAction(actionId: string) {
    const target = popoverRef.current;
    if (target === null) {
      return;
    }
    game.chooseAction(actionId, target);
    closePopover();
  }

  const hiddenBoardId =
    gesture !== null &&
    gesture.kind !== "pending" &&
    gesture.source === "board"
      ? gesture.pieceId
      : null;
  const hiddenTrayId =
    gesture !== null &&
    gesture.kind !== "pending" &&
    gesture.source === "tray"
      ? gesture.pieceId
      : null;
  const hover =
    gesture !== null && gesture.kind === "dragging" && gesture.hover !== null
      ? { cell: gesture.hover, allowed: gesture.allowed }
      : null;
  const anchorCell = popover === null ? null : popover.cell;
  const tray = boardState.trayPieces();
  const tokenSize = cellSize > 0 ? Math.min(cellSize * 0.92, 64) : 48;
  const cellVariable = (cellSize > 0 ? cellSize : 48) + "px";
  const pageStyle = { "--cell": cellVariable } as CSSProperties;

  let popoverNode = null;
  if (
    popover !== null &&
    rootRef.current !== null &&
    boardRef.current !== null &&
    cellSize > 0
  ) {
    popoverNode = (
      <Popover
        key={targetKey(popover)}
        description={describeTarget(boardState, popover)}
        anchor={cellAnchor(boardRef.current, popover.cell, cellSize)}
        bounds={readSafeBounds(rootRef.current)}
        onAction={onAction}
        onDismiss={closePopover}
      />
    );
  }

  const ghost =
    gesture !== null && gesture.kind !== "pending" ? gesture : null;
  let ghostPiece: Piece | null = null;
  if (ghost !== null) {
    ghostPiece = boardState.pieceById(ghost.pieceId);
  }

  return (
    <main
      ref={rootRef}
      className={"puzzle " + (landscape ? "puzzle--landscape" : "puzzle--portrait")}
      data-layout={landscape ? "landscape" : "portrait"}
      data-testid="puzzle-root"
      style={pageStyle}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onContextMenu={(event) => event.preventDefault()}
    >
      <div className="puzzle__board-slot" ref={slotRef}>
        {cellSize > 0 && (
          <Board
            state={boardState}
            cellSize={cellSize}
            hover={hover}
            anchorCell={anchorCell}
            hiddenPieceId={hiddenBoardId}
            boardRef={boardRef}
          />
        )}
      </div>
      <aside className="puzzle__panel">
        <h1 className="puzzle__title" tabIndex={-1}>
          Sandbox
        </h1>
        <p className="puzzle__tray-label">Tray</p>
        <div className="puzzle__tray" aria-label="Tray">
          {tray.map((piece) => (
            <div
              key={piece.id}
              className="puzzle__token"
              data-tray-piece={piece.id}
              style={{ width: tokenSize, height: tokenSize }}
              hidden={hiddenTrayId === piece.id}
            >
              <svg
                width={tokenSize}
                height={tokenSize}
                viewBox={"0 0 " + tokenSize + " " + tokenSize}
                aria-hidden="true"
              >
                <PieceShapes piece={piece} size={tokenSize} />
              </svg>
            </div>
          ))}
        </div>
        <div className="puzzle__controls" data-no-gesture="true">
          <button type="button" onClick={onReset}>
            Reset
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            aria-pressed={muted}
          >
            {muted ? "Unmute" : "Mute"}
          </button>
        </div>
      </aside>
      {popoverNode}
      {ghost !== null && ghostPiece !== null && (
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
              ghost.kind === "returning" && ghost.animate
                ? "transform 160ms ease-out"
                : "none",
          }}
        >
          <svg
            width={ghost.size}
            height={ghost.size}
            viewBox={"0 0 " + ghost.size + " " + ghost.size}
            aria-hidden="true"
          >
            <PieceShapes piece={ghostPiece} size={ghost.size} />
          </svg>
        </div>
      )}
    </main>
  );
};

export default PuzzlePage;
