import { app, BrowserWindow, Menu, MenuItemConstructorOptions } from "electron"
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
    title?: string
}

export const createBrowserWindow = (option: BrowserWindowOption): BrowserWindow => {
    const {id, type, preloadScriptPath, isVisible = true, url, localFilePath, title} = option;
    let window: BrowserWindow | null = new BrowserWindow({
        width: DEFAULT_WIDTH,
        height: DEFAULT_HEIGHT,
        webPreferences: preloadScriptPath ? {
            preload: preloadScriptPath,
            devTools: false,
        } : {},
        show: isVisible,
        title: title ?? "Main window",
    });

    // Prevent refresh on dist environment
    if(app.isPackaged) {
        window.webContents.on('before-input-event', (event, input) => {
        if (
            input.key === 'F5' || 
            (input.control && input.key === 'r') || 
            (input.control && input.shift && input.key === 'R')
        ) {
            event.preventDefault();
        }
        });
    }


    if(type === 'web' && url) {
        window.loadURL(url);
    } else if (type ==='local' && localFilePath) {
        window.loadFile(localFilePath);
    }


    // Menu template
    const submenus: MenuItemConstructorOptions[] = [
        {role: 'about'},
        {role: 'quit'},
    ];

    const menuOption: MenuItemConstructorOptions = {
        label: 'Edit',
        submenu: submenus
    };

    if(!app.isPackaged) {
        submenus.push({role: 'toggleDevTools'});
        submenus.push({role: 'reload'});
    }

    const template:MenuItemConstructorOptions[] = [menuOption];
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    window.on('close', () => {
        window = null;
        if(AppController.Instance.uiController.windows.has(id)) {
            AppController.Instance.uiController.windows.delete(id);
        }
    });

    AppController.Instance.uiController.windows.set(id, window);
    
    return window;
}