import { IUserAuth, IUserAuthKey, IUserData } from "./interfaces/UserInterfaces";
import { provides } from "./DependencyContainer/decorators";
import {FbApp} from "./FbApp";
import {
    getAuth,
    GoogleAuthProvider,
    Auth
} from "firebase/auth";



@provides<IUserAuth>(IUserAuthKey)
class HbAuth implements IUserAuth {

    private provider:GoogleAuthProvider;

    private auth:Auth;

    constructor() {
        this.provider = new GoogleAuthProvider();
        this.auth = getAuth(FbApp.current);
    }

    connect(): void {
        console.log("CONNECTING FROM HbAuth")
;        // todo: set up listener then dispatch event
    }
}