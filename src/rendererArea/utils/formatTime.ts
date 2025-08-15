/**
 * Utility: format seconds as mm:ss
 */
export function formatTime(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const mPart = Math.floor(s / 60);
  const sPart = s % 60;
  return `${mPart}:${sPart.toString().padStart(2, "0")}`;
}