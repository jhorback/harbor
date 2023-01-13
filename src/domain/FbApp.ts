import { initializeApp, FirebaseApp } from "firebase/app";
import { HbApp } from "./HbApp";


export class FbApp {
    private static _current?:FirebaseApp = undefined;

    static get current() {
        if (!FbApp._current) {
            FbApp._current = initializeApp(HbApp.config.fbConfig);
        }
        return FbApp._current;
    }
}



