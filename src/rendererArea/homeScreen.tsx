// HomeScreen.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { LyricSegment } from "./types/lyricSegment";
import { LyricsPrompter } from "./components/lyricsPrompter";
import { JogShuttle } from "./components/jogShuttle";
import { LyricEditor } from "./components/lyricEditor";

type ViewMode = "prompter" | "editor";

export const HomeScreen = () => {
  const [view, setView] = useState<ViewMode>("editor");

  // 공유 상태
  const [segments, setSegments] = useState<LyricSegment[]>([
    { pronunciation: "hana dul set net", text: "하나 둘 셋 넷, 노래를 시작해", start: 0, end: 3.5 },
    { pronunciation: "bichi seumyeodeuneun", text: "빛이 스며드는 이 밤의 끝에서", start: 3.5, end: 7.6 },
    { pronunciation: "urineun noraehae", text: "우리는 노래해, 자유롭게", start: 7.6, end: 11.2 },
    { pronunciation: "hamkkeramyeon", text: "함께라면 어디라도 갈 수 있어", start: 11.2, end: 15.8 },
  ]);
  const duration = useMemo(
    () => (segments.length ? segments[segments.length - 1].end : 0),
    [segments]
  );

  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);

  useEffect(() => setTime(t => Math.min(t, duration)), [duration]);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
      return;
    }
    const tick = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => (t + dt >= duration ? duration : t + dt));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [playing, duration]);

  const handleSeek = (newTime: number) =>
    setTime(Math.max(0, Math.min(duration, newTime)));
  const handleToggle = () => {
    if (time >= duration) setTime(0);
    setPlaying(p => !p);
  };

  return (
    <div className="h-screen w-screen bg-black text-white p-4">
      <div className="flex h-full w-full flex-col gap-3">
        {/* 상단 전환 바 */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            onClick={() => setView("prompter")}
            className={`px-4 py-2 rounded-lg border ${
              view === "prompter"
                ? "bg-white text-black border-white"
                : "bg-slate-900 border-slate-600"
            }`}
          >
            Prompter
          </button>
          <button
            onClick={() => setView("editor")}
            className={`px-4 py-2 rounded-lg border ${
              view === "editor"
                ? "bg-white text-black border-white"
                : "bg-slate-900 border-slate-600"
            }`}
          >
            Editor
          </button>
        </div>

        {/* 본문 패널 */}
        <div className="flex-1 overflow-hidden">
          {view === "prompter" ? (
            // ----- 전체 프롬프터 -----
            <div className="h-full w-full rounded-2xl p-4 bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col">
              <LyricsPrompter
                segments={segments}
                currentTime={time}
                className="flex-1 justify-center"
              />
              <JogShuttle
                currentTime={time}
                duration={duration}
                isPlaying={playing}
                onSeek={handleSeek}
                onTogglePlay={handleToggle}
                className="mt-6"
              />
            </div>
          ) : (
            // ----- 좌우 1:1 분할 (프롬프터 | 에디터) -----
            <div className="h-full w-full flex gap-3 overflow-hidden">
              {/* LEFT: 프롬프터(절반) */}
              <div className="basis-1/2 rounded-2xl p-4 bg-slate-900/60 border border-slate-800 overflow-hidden flex flex-col">
                <LyricsPrompter
                  segments={segments}
                  currentTime={time}
                  className="flex-1 justify-center"
                />
                <JogShuttle
                  currentTime={time}
                  duration={duration}
                  isPlaying={playing}
                  onSeek={handleSeek}
                  onTogglePlay={handleToggle}
                  className="mt-6"
                />
              </div>

              {/* RIGHT: 에디터(절반) */}
              <div className="basis-1/2 rounded-2xl p-4 bg-slate-900/60 border border-slate-800 overflow-hidden">
                {/* LyricEditor 내부에서 헤더 sticky + 리스트 스크롤 */}
                <LyricEditor value={segments} onChange={setSegments} className="h-full" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
