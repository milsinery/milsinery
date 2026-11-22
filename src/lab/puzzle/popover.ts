import { ActionTarget, GameState } from "./core";

/** Plain description of a popover. The view renders it; SpriteKit can too. */
export interface ActionItem {
  id: string;
  label: string;
}

export interface PopoverDescription {
  title: string;
  lines: string[];
  actions: ActionItem[];
}

export type PopoverContentSource = (
  state: GameState,
  target: ActionTarget
) => PopoverDescription;
