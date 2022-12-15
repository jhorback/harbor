import { getFirestore } from "firebase/firestore";
import { FbApp } from "./FbApp";
export class HbDb {
    static { this._current = undefined; }
    static get current() {
        if (!HbDb._current) {
            HbDb._current = getFirestore(FbApp.current);
            ;
        }
        return HbDb._current;
    }
}
