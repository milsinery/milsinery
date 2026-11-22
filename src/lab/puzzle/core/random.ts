import { RandomSource } from "./types";

/**
 * 32-bit LCG. Swift port: use overflowing multiply, same constants.
 * `next` returns a value in [0, 1).
 */
export function createLcg(seed: number): RandomSource {
  let state = seed >>> 0;
  if (state === 0) {
    state = 1;
  }
  return {
    next(): number {
      state = (Math.imul(1664525, state) + 1013904223) >>> 0;
      return state / 4294967296;
    },
  };
}
