import { IUserAuth, IUserAuthKey, IUserData } from "./interfaces/UserInterfaces";
import dc from "./DependencyContainer";
import {FbApp} from "./FbApp";
import {
    getAuth,
    GoogleAuthProvider,
    Auth
} from "firebase/auth";






// todo: create a decorator
// @dependency<T>(symbol)
class HbAuth implements IUserAuth {

    private provider:GoogleAuthProvider;

    private auth:Auth;

    constructor() {
        this.provider = new GoogleAuthProvider();
        this.auth = getAuth(FbApp.current);
    }

    connect(): void {
        console.log("CONNECTING FROM HbAuth")
;        // set up listener then dispatch event
    }
}
dc.register<IUserAuth>(IUserAuthKey, HbAuth);



