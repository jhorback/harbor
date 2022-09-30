import { initializeApp, FirebaseApp } from "firebase/app";
import { HbConfig } from "./HbConfig";


export class FbApp {
    private static _current?:FirebaseApp = undefined;

    static get current() {
        if (!FbApp._current) {
            FbApp._current = initializeApp(HbConfig.current.fbConfig);
        }
        return FbApp._current;
    }
}



