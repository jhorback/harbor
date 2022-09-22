import { getAuth } from "firebase/auth";
import { FbApp } from "./FbApp";
export class HbCurrentUser {
    constructor() {
        this.auth = getAuth(FbApp.current);
    }
    get uid() {
        return this.auth.currentUser?.uid;
    }
}
