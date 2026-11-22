import { Piece, Shape } from "../core";
import { fillForToken } from "./colors";

export function PieceShapes(props: { piece: Piece; size: number }) {
  const size = props.size;
  const fill = fillForToken(props.piece.colorToken);
  const textY = props.piece.shape === "triangle" ? size * 0.58 : size / 2;
  return (
    <>
      {shapeNode(props.piece.shape, size, fill)}
      <text
        x={size / 2}
        y={textY}
        textAnchor="middle"
        dominantBaseline="central"
        fill="#ffffff"
        fontSize={size * 0.3}
        fontWeight={700}
        fontFamily="Montserrat, sans-serif"
        style={{ pointerEvents: "none" }}
      >
        {props.piece.label}
      </text>
    </>
  );
}

function shapeNode(shape: Shape, size: number, fill: string) {
  const center = size / 2;
  if (shape === "circle") {
    return <circle cx={center} cy={center} r={size * 0.32} fill={fill} />;
  }
  if (shape === "square") {
    const side = size * 0.58;
    return (
      <rect
        x={center - side / 2}
        y={center - side / 2}
        width={side}
        height={side}
        rx={size * 0.08}
        fill={fill}
      />
    );
  }
  if (shape === "diamond") {
    const radius = size * 0.34;
    return (
      <polygon
        points={
          center +
          "," +
          (center - radius) +
          " " +
          (center + radius) +
          "," +
          center +
          " " +
          center +
          "," +
          (center + radius) +
          " " +
          (center - radius) +
          "," +
          center
        }
        fill={fill}
      />
    );
  }
  const side = size * 0.64;
  const height = (Math.sqrt(3) / 2) * side;
  const top = center - height / 2;
  const bottom = top + height;
  const left = center - side / 2;
  const right = center + side / 2;
  return (
    <polygon
      points={center + "," + top + " " + right + "," + bottom + " " + left + "," + bottom}
      fill={fill}
    />
  );
}
