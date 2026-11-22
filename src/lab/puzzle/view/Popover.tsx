import { useLayoutEffect, useRef, useState } from "react";
import { PopoverDescription } from "../popover";
import { placePopover, Rect } from "./placement";

const POPOVER_GAP_PX = 8;

export function Popover(props: {
  description: PopoverDescription;
  anchor: Rect;
  bounds: Rect;
  onAction: (actionId: string) => void;
  onDismiss: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null
  );

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (card === null) {
      return undefined;
    }
    const measure = () => {
      const width = card.offsetWidth;
      const height = card.offsetHeight;
      setSize((previous) => {
        if (
          previous !== null &&
          Math.abs(previous.width - width) < 1 &&
          Math.abs(previous.height - height) < 1
        ) {
          return previous;
        }
        return { width: width, height: height };
      });
    };
    measure();
    if (typeof ResizeObserver === "undefined") {
      return undefined;
    }
    const observer = new ResizeObserver(measure);
    observer.observe(card);
    return () => observer.disconnect();
  }, [props.description]);

  const decision =
    size === null
      ? null
      : placePopover({
          anchor: props.anchor,
          popover: size,
          bounds: props.bounds,
          gap: POPOVER_GAP_PX,
        });

  const card = (
    <div
      ref={cardRef}
      className={
        "puzzle__popover" +
        (decision === null ? " puzzle__popover--measure" : "") +
        (decision !== null && decision.mode === "anchor"
          ? " puzzle__popover--anchor"
          : "")
      }
      role="dialog"
      aria-modal={decision !== null && decision.mode === "sheet"}
      aria-labelledby="puzzle-popover-title"
      tabIndex={-1}
      data-popover-root="true"
      data-placement={
        decision === null
          ? "measure"
          : decision.mode === "sheet"
          ? "sheet"
          : decision.side
      }
      style={
        decision !== null && decision.mode === "anchor"
          ? { top: decision.top, left: decision.left }
          : undefined
      }
    >
      <p id="puzzle-popover-title" className="puzzle__popover-title">
        {props.description.title}
      </p>
      {props.description.lines.map((line) => (
        <p key={line} className="puzzle__popover-line">
          {line}
        </p>
      ))}
      <div className="puzzle__popover-actions">
        {props.description.actions.map((action) => (
          <button
            key={action.id}
            type="button"
            onClick={() => props.onAction(action.id)}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );

  if (decision !== null && decision.mode === "sheet") {
    return (
      <div className="puzzle__sheet" data-popover-root="true">
        <button
          type="button"
          className="puzzle__sheet-dismiss"
          aria-label="Close"
          onClick={props.onDismiss}
        />
        {card}
      </div>
    );
  }

  return card;
}
