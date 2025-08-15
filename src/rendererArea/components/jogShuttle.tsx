import { formatTime } from '../utils/formatTime';

/**
 * JogShuttle
 * - Elapsed time (left), remaining time (right)
 * - Center slider to control current position
 * - Play/Pause button centered below
 */
export function JogShuttle({
  currentTime,
  duration,
  isPlaying,
  onSeek,
  onTogglePlay,
  className = "",
}: {
  currentTime: number; // seconds
  duration: number; // seconds
  isPlaying: boolean;
  onSeek: (newTime: number) => void;
  onTogglePlay: () => void;
  className?: string;
}) {
  const clampedTime = Math.max(0, Math.min(duration, currentTime));
  const remaining = Math.max(0, duration - clampedTime);

  return (
    <div className={`w-full ${className}`} role="group" aria-label="Jog shuttle">
      <div className="flex items-center gap-3">
        <div className="w-20 text-right tabular-nums text-sm text-slate-300" aria-label="Elapsed time">
          {formatTime(clampedTime)}
        </div>
        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={clampedTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          className="flex-1 accent-white h-2 rounded-full bg-slate-700"
          aria-label="Scrub timeline"
        />
        <div className="w-20 text-left tabular-nums text-sm text-slate-300" aria-label="Remaining time">
          -{formatTime(remaining)}
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={onTogglePlay}
          className="px-5 py-2 rounded-2xl shadow-md bg-white/10 text-white hover:bg-white/20 active:scale-95 transition"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚ Pause" : "► Play"}
        </button>
      </div>
    </div>
  );
}
