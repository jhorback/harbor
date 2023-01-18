import { initializeApp } from "firebase/app";
import { HbApp } from "./HbApp";
export class FbApp {
    static { this._current = undefined; }
    static get current() {
        if (!FbApp._current) {
            FbApp._current = initializeApp(HbApp.config.fbConfig);
        }
        return FbApp._current;
    }
}
