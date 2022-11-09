import { getStorage } from "firebase/storage";
import { FbApp } from "./FbApp";
export class HbStorage {
    static get current() {
        if (!HbStorage._current) {
            HbStorage._current = getStorage(FbApp.current);
            ;
        }
        return HbStorage._current;
    }
}
HbStorage._current = undefined;
