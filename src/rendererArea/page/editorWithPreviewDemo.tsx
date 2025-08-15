import { useState, useRef, useEffect } from "react";
import { LyricEditor } from "../components/lyricEditor";
import { LyricSegment } from "../types/lyricSegment";
import { LyricsPrompter } from '../components/lyricsPrompter';
import { JogShuttle } from '../components/jogShuttle';

export default function EditorWithPreviewDemo() {
  const [segments, setSegments] = useState<LyricSegment[]>([
    { pronunciation: "hana dul set net", text: "하나 둘 셋 넷, 노래를 시작해", start: 0, end: 3.5 },
    { pronunciation: "bichi seumyeodeuneun", text: "빛이 스며드는 이 밤의 끝에서", start: 3.5, end: 7.6 },
    { pronunciation: "urineun noraehae", text: "우리는 노래해, 자유롭게", start: 7.6, end: 11.2 },
    { pronunciation: "hamkkeramyeon", text: "함께라면 어디라도 갈 수 있어", start: 11.2, end: 15.8 },
  ]);

  const PREVIEW_HEIGHT = "h-[640px]";

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
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      setTime(t => {
        const next = t + dt;
        return next >= duration ? duration : next;
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [playing, duration]);

  const handleSeek = (newTime: number) => setTime(Math.max(0, Math.min(duration, newTime)));
  const handleToggle = () => {
    if (time >= duration) setTime(0);
    setPlaying(p => !p);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 p-6 bg-black text-white min-h-[70vh]">
      {/* LEFT: 프리뷰(고정 높이) */}
      <div className={`flex flex-col rounded-2xl p-4 bg-slate-900/60 border border-slate-800 ${PREVIEW_HEIGHT} overflow-hidden`}>
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

      {/* RIGHT: 에디터(프리뷰와 동일 높이, 내부에서 리스트만 스크롤) */}
      <div className={`rounded-2xl p-4 bg-slate-900/60 border border-slate-800`}>
        {/* LyricEditor 내부에서 헤더 고정 + 리스트 스크롤 처리 */}
        <LyricEditor value={segments} onChange={setSegments} className="h-full" />
      </div>
    </div>
  );
}
