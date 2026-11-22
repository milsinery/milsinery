import { RefObject } from "react";
import { Cell, cellIndex, celestialOf, CONFIG, GameState } from "../core";

export function Board(props: {
  state: GameState;
  cellSize: number;
  hover: { cell: Cell; allowed: boolean } | null;
  anchorCell: Cell | null;
  boardRef: RefObject<SVGSVGElement>;
}) {
  const { state, cellSize } = props;
  const size = CONFIG.boardSize;
  const boardWidth = cellSize * size;
  const boardHeight = cellSize * size;
  const sky = celestialOf(state.turn);
  const cells = [];
  for (let row = 0; row < size; row++) {
    for (let column = 0; column < size; column++) {
      const data = state.cells[cellIndex(column, row)];
      const hovered =
        props.hover !== null &&
        props.hover.cell.column === column &&
        props.hover.cell.row === row;
      const anchored =
        props.anchorCell !== null &&
        props.anchorCell.column === column &&
        props.anchorCell.row === row;
      cells.push(
        <g key={column + "-" + row} transform={"translate(" + column * cellSize + " " + row * cellSize + ")"}>
          <rect
            width={cellSize}
            height={cellSize}
            className={
              "puzzle__terrain puzzle__terrain--" +
              data.terrain +
              (column === sky.column ? " is-column" : "")
            }
            data-cell={column + "," + row}
            data-column={column}
            data-row={row}
            data-terrain={data.terrain}
            data-item={data.item === null ? "" : data.item}
          />
          {hovered && (
            <rect
              width={cellSize}
              height={cellSize}
              className={props.hover !== null && props.hover.allowed ? "puzzle__cell-hover-ok" : "puzzle__cell-hover-bad"}
              data-hover={column + "," + row}
            />
          )}
          {anchored && <rect width={cellSize} height={cellSize} className="puzzle__cell-anchor" />}
          {data.item !== null && (
            <text
              x={cellSize / 2}
              y={cellSize / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={cellSize * 0.42}
              className="puzzle__emoji"
            >
              {itemIcon(data.item)}
            </text>
          )}
          {data.fireAge > 0 && (
            <text
              x={cellSize * 0.78}
              y={cellSize * 0.28}
              textAnchor="middle"
              fontSize={cellSize * 0.28}
              className="puzzle__emoji"
            >
              🔥
            </text>
          )}
        </g>
      );
    }
  }

  const cloud = state.cloud;
  let cloudRect = null;
  if (cloud !== null) {
    cloudRect = (
      <rect
        x={cloud.column * cellSize}
        y={cloud.row * cellSize}
        width={cellSize * 2}
        height={cellSize * 2}
        className="puzzle__cloud"
        data-cloud-rect="true"
      />
    );
  }

  return (
    <svg
      ref={props.boardRef}
      className="puzzle__board"
      width={boardWidth}
      height={boardHeight}
      viewBox={"0 0 " + boardWidth + " " + boardHeight}
      role="grid"
      aria-label="Поле"
      data-testid="puzzle-board"
    >
      {cells}
      {cloudRect}
    </svg>
  );
}

function itemIcon(item: string): string {
  if (item === "house") return "🏠";
  if (item === "sawmill") return "🪵";
  if (item === "hunter") return "🏹";
  if (item === "boat") return "🚤";
  if (item === "field") return "🌱";
  return "";
}
