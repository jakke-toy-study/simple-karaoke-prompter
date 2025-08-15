import { BrowserWindow } from "electron";

export class UIController {
    constructor() {
        this.windows = new Map();
    }

    readonly windows: Map<string, BrowserWindow>;
}