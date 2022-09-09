import { initializeApp } from "firebase/app";
import { HbConfig } from "./HbConfig";
export class FbApp {
    static get current() {
        if (!FbApp._current) {
            FbApp._current = initializeApp(HbConfig.current.fbConfig);
        }
        return FbApp._current;
    }
}
FbApp._current = undefined;
