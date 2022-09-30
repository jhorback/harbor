import { Firestore, getFirestore } from "firebase/firestore";
import { FbApp } from "./FbApp";


export class HbDb {
    private static _current?:Firestore = undefined;

    static get current() {
        if (!HbDb._current) {
            HbDb._current = getFirestore(FbApp.current);;
        }
        return HbDb._current;
    }
}



