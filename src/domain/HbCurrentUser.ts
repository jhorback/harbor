import { Auth, getAuth } from "firebase/auth";
import { FbApp } from "./FbApp";


export class HbCurrentUser {

    constructor() {
        this.auth = getAuth(FbApp.current);
    }
    
    private auth:Auth;

    get uid():string|undefined {
        return this.auth.currentUser?.uid;
    }
}