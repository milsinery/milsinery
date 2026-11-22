import { RefObject } from "react";
import { Cell, cellsEqual, GameState } from "../core";
import { PieceShapes } from "./PieceGraphic";

export function Board(props: {
  state: GameState;
  cellSize: number;
  hover: { cell: Cell; allowed: boolean } | null;
  anchorCell: Cell | null;
  hiddenPieceId: string | null;
  boardRef: RefObject<SVGSVGElement>;
}) {
  const { state, cellSize } = props;
  const columns = state.grid.width;
  const rows = state.grid.height;
  const boardWidth = cellSize * columns;
  const boardHeight = cellSize * rows;
  const stroke = Math.max(1, cellSize * 0.025);
  const lines: JSX.Element[] = [];

  for (let column = 1; column < columns; column++) {
    const x = column * cellSize;
    lines.push(
      <line
        key={"column-" + column}
        x1={x}
        y1={0}
        x2={x}
        y2={boardHeight}
        className="puzzle__grid-line"
        strokeWidth={stroke}
      />
    );
  }
  for (let row = 1; row < rows; row++) {
    const y = row * cellSize;
    lines.push(
      <line
        key={"row-" + row}
        x1={0}
        y1={y}
        x2={boardWidth}
        y2={y}
        className="puzzle__grid-line"
        strokeWidth={stroke}
      />
    );
  }

  const cells: JSX.Element[] = [];
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      cells.push(
        <rect
          key={column + "-" + row}
          x={column * cellSize}
          y={row * cellSize}
          width={cellSize}
          height={cellSize}
          fill="transparent"
          data-cell={column + "," + row}
          data-column={column}
          data-row={row}
        />
      );
    }
  }

  const pieces: JSX.Element[] = [];
  for (let index = 0; index < state.placements.length; index++) {
    const placement = state.placements[index];
    const piece = state.pieceById(placement.pieceId);
    if (piece === null) {
      continue;
    }
    const hidden = props.hiddenPieceId === piece.id;
    pieces.push(
      <g
        key={piece.id}
        transform={
          "translate(" +
          placement.cell.column * cellSize +
          " " +
          placement.cell.row * cellSize +
          ")"
        }
        data-piece-id={piece.id}
        data-cell={placement.cell.column + "," + placement.cell.row}
        visibility={hidden ? "hidden" : "visible"}
      >
        <PieceShapes piece={piece} size={cellSize} />
      </g>
    );
  }

  let hoverRect = null;
  if (props.hover !== null) {
    const hover = props.hover;
    hoverRect = (
      <rect
        x={hover.cell.column * cellSize}
        y={hover.cell.row * cellSize}
        width={cellSize}
        height={cellSize}
        className={
          hover.allowed ? "puzzle__cell-hover-ok" : "puzzle__cell-hover-bad"
        }
        data-hover={hover.cell.column + "," + hover.cell.row}
      />
    );
  }

  let anchorRect = null;
  if (props.anchorCell !== null) {
    const anchor = props.anchorCell;
    const sameAsHover =
      props.hover !== null && cellsEqual(props.hover.cell, anchor);
    if (sameAsHover === false) {
      anchorRect = (
        <rect
          x={anchor.column * cellSize}
          y={anchor.row * cellSize}
          width={cellSize}
          height={cellSize}
          className="puzzle__cell-anchor"
        />
      );
    }
  }

  return (
    <svg
      ref={props.boardRef}
      className="puzzle__board"
      width={boardWidth}
      height={boardHeight}
      viewBox={"0 0 " + boardWidth + " " + boardHeight}
      role="grid"
      aria-label="Board"
      data-testid="puzzle-board"
    >
      <defs>
        <clipPath id="puzzle-board-clip">
          <rect
            width={boardWidth}
            height={boardHeight}
            rx={cellSize * 0.08}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#puzzle-board-clip)">
        <rect
          className="puzzle__board-bg"
          width={boardWidth}
          height={boardHeight}
        />
        {hoverRect}
        {anchorRect}
        {lines}
        {cells}
        {pieces}
      </g>
    </svg>
  );
}
