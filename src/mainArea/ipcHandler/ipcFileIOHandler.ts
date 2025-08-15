import { dialog, IpcMain } from "electron";
import fs from 'fs';

export function setIPCFileIOHandler(ipcMain: IpcMain) {
    ipcMain.handle("load-lyrics", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
        filters: [{ name: "JSON Files", extensions: ["json"] }],
        properties: ["openFile"],
    });
    if (canceled || filePaths.length === 0) return null;

    const raw = await fs.promises.readFile(filePaths[0], "utf-8");
    return JSON.parse(raw); // LyricSegment[]
    });
}