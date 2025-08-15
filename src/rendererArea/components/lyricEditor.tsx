import { LyricSegment } from '../types/lyricSegment';

export function LyricEditor({
  value,
  onChange,
  className = "",
}: {
  value: LyricSegment[];
  onChange: (next: LyricSegment[]) => void;
  className?: string;
}) {
  const addLine = () => {
    const lastEnd = value.length ? value[value.length - 1].end : 0;
    const next: LyricSegment = { text: "", pronunciation: "", start: lastEnd, end: lastEnd + 3 };
    onChange([...value, next]);
  };

  const loadFromFile = async () => {
    const segments = await window.electronIPCFileIOAPI.loadLyric();
    if (segments) {
      onChange(segments);
    }
  };

  const deleteLine = (idx: number) => onChange(value.filter((_, i) => i !== idx));

  const move = (idx: number, dir: -1 | 1) => {
    const j = idx + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[idx], next[j]] = [next[j], next[idx]];
    onChange(next);
  };

  const patch = (idx: number, patcher: Partial<LyricSegment>) => {
    const next = [...value];
    next[idx] = { ...next[idx], ...patcher };
    onChange(next);
  };

  const download = () => {
    const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lyrics_${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    // 핵심: flex-col + h-full + min-h-0 (자식이 스크롤 가능하도록)
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      {/* 고정 헤더: sticky top-0 */}
      <div className="shrink-0 sticky top-0 z-10 flex gap-2 bg-slate-900/70 backdrop-blur rounded-lg p-2 border border-slate-800">
        <button onClick={addLine} className="px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-500">+ 줄 추가</button>
        <button
          onClick={loadFromFile}
          className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500"
        >
          JSON 불러오기
        </button>
        <button onClick={download} className="px-3 py-2 rounded-lg bg-sky-700 text-white hover:bg-sky-600">JSON 다운로드</button>
      </div>

      {/* 리스트: 여기만 스크롤 */}
      <div className="mt-3 flex-1 overflow-y-auto">
        <div className="grid gap-2">
          {value.map((seg, idx) => {
            const invalid = seg.end <= seg.start;
            return (
              <div key={idx} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  {/* 줄 번호: 굵은 흰색 */}
                  <span className="text-sm font-extrabold text-white">#{idx + 1}</span>
                  <div className="ml-auto flex gap-2">
                    <button onClick={() => move(idx, -1)} className="px-2 py-1 rounded-md bg-slate-700 text-white hover:bg-slate-600">↑</button>
                    <button onClick={() => move(idx, 1)} className="px-2 py-1 rounded-md bg-slate-700 text-white hover:bg-slate-600">↓</button>
                    <button onClick={() => deleteLine(idx)} className="px-2 py-1 rounded-md bg-rose-700 text-white hover:bg-rose-600">삭제</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-2 items-center">
                  <input
                    value={seg.pronunciation ?? ""}
                    onChange={(e) => patch(idx, { pronunciation: e.target.value })}
                    placeholder="발음 / Pronunciation (위)"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 outline-none focus:border-slate-500"
                  />
                  <input
                    value={seg.text}
                    onChange={(e) => patch(idx, { text: e.target.value })}
                    placeholder="가사 / Lyric (아래)"
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 outline-none focus:border-slate-500"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={seg.start}
                    onChange={(e) => patch(idx, { start: parseFloat(e.target.value) || 0 })}
                    className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 outline-none focus:border-slate-500 w-32"
                    aria-label="start"
                  />
                  <input
                    type="number"
                    step="0.01"
                    value={seg.end}
                    onChange={(e) => patch(idx, { end: parseFloat(e.target.value) || 0 })}
                    className={`px-3 py-2 rounded-lg bg-slate-900 border w-32 outline-none focus:border-slate-500 ${invalid ? "border-rose-500" : "border-slate-700"}`}
                    aria-label="end"
                  />
                </div>

                {invalid && (
                  <div className="text-rose-400 text-xs">end 시간은 start 보다 커야 합니다.</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
