import { FirebaseStorage, getStorage } from "firebase/storage";
import { FbApp } from "./FbApp";


export class HbStorage {
    private static _current?:FirebaseStorage = undefined;

    static get current() {
        if (!HbStorage._current) {
            HbStorage._current = getStorage(FbApp.current);;
        }
        return HbStorage._current;
    }
}