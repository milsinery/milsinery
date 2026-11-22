const FILLS: { [token: string]: string } = {
  ink: "#243038",
  clay: "#a34732",
  moss: "#2a6244",
  sand: "#8d6414",
  sea: "#2a5e8a",
};

/** View-only. Core stores the token string and does not know these hex values. */
export function fillForToken(token: string): string {
  const fill = FILLS[token];
  if (fill === undefined) {
    return "#5c6570";
  }
  return fill;
}
