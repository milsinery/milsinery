/** Movement past this distance is a drag. At or under it, the gesture is a tap. */
export const TAP_DRAG_THRESHOLD_PX = 10;

export function isDragGesture(deltaX: number, deltaY: number): boolean {
  const threshold = TAP_DRAG_THRESHOLD_PX;
  return deltaX * deltaX + deltaY * deltaY >= threshold * threshold;
}
