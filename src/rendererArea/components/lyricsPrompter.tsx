import { LyricSegment } from "../types/lyricSegment";
import { WipeText } from '../components/wipeText';
import { useMemo } from "react";

/**
 * ===== Prompter (updated to support pronunciation ABOVE the lyric) =====
 */
export function LyricsPrompter({
  segments,
  currentTime,
  className = "",
  playedClassName = "text-white",
  unplayedClassName = "text-slate-400",
}: {
  segments: LyricSegment[];
  currentTime: number; // seconds
  className?: string;
  playedClassName?: string;
  unplayedClassName?: string;
}) {
  const { currentIdx, nextIdx, progressPct } = useMemo(() => {
    if (!segments.length)
      return { currentIdx: -1, nextIdx: -1, progressPct: 0 };

    // Current segment is the one whose end is after currentTime
    let idx = segments.findIndex((s) => currentTime < s.end);
    if (idx === -1) idx = segments.length - 1; // past last segment
    const seg = segments[idx];
    const duration = Math.max(0.0001, seg.end - seg.start);
    const pct = ((currentTime - seg.start) / duration) * 100;

    return {
      currentIdx: idx,
      nextIdx: idx + 1 < segments.length ? idx + 1 : -1,
      progressPct: Math.max(0, Math.min(100, pct)),
    };
  }, [segments, currentTime]);

  const current = currentIdx >= 0 ? segments[currentIdx] : undefined;
  const next = nextIdx >= 0 ? segments[nextIdx] : undefined;

  return (
    <div className={`flex flex-col gap-6 items-stretch ${className}`}>
      {/* Current line (pronunciation above, lyric below) */}
      <div className="flex flex-col gap-1">
        <WipeText
          text={current?.pronunciation ?? ""}
          percent={progressPct}
          className="text-2xl md:text-3xl font-medium tracking-wide"
          playedClassName={playedClassName}
          unplayedClassName="text-slate-400"
        />
        <WipeText
          text={current?.text ?? ""}
          percent={progressPct}
          className="text-4xl md:text-5xl font-semibold tracking-wide"
          playedClassName={playedClassName}
          unplayedClassName={unplayedClassName}
        />
      </div>

      {/* Next line (no wipe) */}
      <div className="opacity-70 flex flex-col gap-1">
        <WipeText
          text={next?.pronunciation ?? ""}
          percent={0}
          className="text-xl md:text-2xl font-medium"
          playedClassName={playedClassName}
          unplayedClassName="text-slate-500"
        />
        <WipeText
          text={next?.text ?? ""}
          percent={0}
          className="text-3xl md:text-4xl font-medium"
          playedClassName={playedClassName}
          unplayedClassName="text-slate-600"
        />
      </div>
    </div>
  );
}
