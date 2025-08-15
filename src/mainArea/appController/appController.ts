import { UIController } from "./uiController";

export class AppController {
    static Instance: AppController = new AppController();

    readonly uiController: UIController;

    constructor() {
        this.uiController = new UIController();
    }
}