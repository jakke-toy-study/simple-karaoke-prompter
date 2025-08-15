import { useEffect, useRef, useState } from "react";
import { JogShuttle } from "../components/jogShuttle";
import { LyricsPrompter } from "../components/lyricsPrompter";
import { LyricSegment } from "../types/lyricSegment";

/**
 * Demo wrapper (for quick preview in canvas)
 */
export default function PrompterDemo() {
  // Sample data (replace with your own timing map)
  const segments: LyricSegment[] = [
    { text: "하나 둘 셋 넷, 노래를 시작해", start: 0, end: 3.5 },
    { text: "빛이 스며드는 이 밤의 끝에서", start: 3.5, end: 7.6 },
    { text: "우리는 노래해, 자유롭게", start: 7.6, end: 11.2 },
    { text: "함께라면 어디라도 갈 수 있어", start: 11.2, end: 15.8 },
  ];

  const duration = segments.length ? segments[segments.length - 1].end : 0;
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      return;
    }

    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000; // seconds
      lastTsRef.current = ts;
      setTime((t) => {
        const next = t + dt;
        return next >= duration ? duration : next;
      });
      if (time < duration) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setPlaying(false);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [playing, duration]);

  const handleSeek = (newTime: number) => {
    setTime(Math.max(0, Math.min(duration, newTime)));
  };

  const handleToggle = () => {
    if (time >= duration) setTime(0);
    setPlaying((p) => !p);
  };

  return (
    <div className="min-h-[60vh] w-full p-6 bg-black text-white grid grid-rows-[1fr_auto] gap-6 rounded-2xl">
      <LyricsPrompter
        segments={segments}
        currentTime={time}
        className="justify-self-stretch"
      />

      <JogShuttle
        currentTime={time}
        duration={duration}
        isPlaying={playing}
        onSeek={handleSeek}
        onTogglePlay={handleToggle}
      />
    </div>
  );
}