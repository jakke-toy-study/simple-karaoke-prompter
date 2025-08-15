/**
 * One line that gradually reveals (wipe L→R)
 */
export function WipeText({
  text,
  percent,
  className = "",
  playedClassName = "text-white",
  unplayedClassName = "text-slate-400",
}: {
  text: string;
  percent: number; // 0..100
  className?: string;
  playedClassName?: string;
  unplayedClassName?: string;
}) {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <div className={`relative w-full overflow-hidden whitespace-nowrap ${className}`}>
      {/* Base (unplayed) */}
      <span className={`${unplayedClassName}`}>{text}</span>
      {/* Overlay (played) clipped by width */}
      <span
        className={`absolute inset-0 overflow-hidden pointer-events-none`}
        aria-hidden
        style={{ width: `${pct}%` }}
      >
        <span className={`block ${playedClassName}`}>{text}</span>
      </span>
    </div>
  );
}