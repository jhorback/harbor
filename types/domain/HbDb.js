import { getFirestore } from "firebase/firestore";
import { FbApp } from "./FbApp";
export class HbDb {
    static get current() {
        if (!HbDb._current) {
            HbDb._current = getFirestore(FbApp.current);
            ;
        }
        return HbDb._current;
    }
}
HbDb._current = undefined;
