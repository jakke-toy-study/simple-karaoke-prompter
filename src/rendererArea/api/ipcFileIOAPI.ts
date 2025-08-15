import { LyricSegment } from "../types/lyricSegment";

export interface IPCElectronFileIOAPI {
    loadLyric: () => Promise<LyricSegment[]>;
}

declare global {
    interface Window {
        electronIPCFileIOAPI: IPCElectronFileIOAPI
    }
}