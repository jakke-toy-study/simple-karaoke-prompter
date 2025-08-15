import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electronIPCElectronTest', {
    sendMessage: () => ipcRenderer.invoke('electron-test'),
});

contextBridge.exposeInMainWorld("electronIPCFileIOAPI", {
    loadLyric: () => ipcRenderer.invoke("load-lyrics"),
});