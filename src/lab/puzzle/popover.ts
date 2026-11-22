/** Plain description of a popover. The view renders it; a native menu can too. */
export interface ActionItem {
  id: string;
  label: string;
}

export interface PopoverDescription {
  title: string;
  lines: string[];
  actions: ActionItem[];
}
