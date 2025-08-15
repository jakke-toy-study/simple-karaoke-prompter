import { BrowserWindow } from "electron"
import { AppController } from "../appController";

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export interface BrowserWindowOption {
    id: string,
    type: 'web'|'local',
    preloadScriptPath?: string,
    isVisible?: boolean
    url?: string,
    localFilePath?: string,
}

export const createBrowserWindow = (option: BrowserWindowOption): BrowserWindow => {
    const {id, type, preloadScriptPath, isVisible = true, url, localFilePath} = option;
    let window: BrowserWindow | null = new BrowserWindow({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        webPreferences: preloadScriptPath ? {preload: preloadScriptPath} : {},
        show: isVisible,
    });

    if(type === 'web' && url) {
        window.loadURL(url);
    } else if (type ==='local' && localFilePath) {
        window.loadFile(localFilePath);
    }

    window.on('close', () => {
        window = null;
        if(AppController.Instance.uiController.windows.has(id)) {
            AppController.Instance.uiController.windows.delete(id);
        }
    });

    AppController.Instance.uiController.windows.set(id, window);
    
    return window;
}