import { IUserAuth, IUserAuthKey, IUserData } from "./interfaces/UserInterfaces";
import { provides } from "./DependencyContainer/decorators";
import {FbApp} from "./FbApp";
import { HbApp } from "./HbApp";
import {
    getAuth,
    GoogleAuthProvider,
    Auth,
    onAuthStateChanged,
    signOut,
    getRedirectResult,
    User,
    signInWithRedirect
} from "firebase/auth";


@provides<IUserAuth>(IUserAuthKey, !HbApp.isStorybook)
class HbAuth implements IUserAuth {

    provider:GoogleAuthProvider;

    auth:Auth;

    connected:Boolean = false;

    constructor() {
        this.provider = new GoogleAuthProvider();
        this.auth = getAuth(FbApp.current);
    }

    connect(): void {
        if (this.connected) {
            return;
        }

        setupAuthListener(this);
        this.connected = true; 
    }

    async signOut():Promise<void> {
        return new Promise((resolve, reject) => {
            signOut(this.auth).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }
}



const setupAuthListener = (hbAuth:HbAuth) => {

    onAuthStateChanged(hbAuth.auth, (user) => {
        // harbor #10
        // dispatch event first then
        // need to load user from the database and
        // insert if not there
        // need to set firstLogin, lastLogin, and role

        const userData:IUserData = user ? getUserDataFromUser(user) : {
            isAuthenticated: false,
            uid: "",
            displayName: ""
        };

        currentUserChanged(userData);    
    });

    getRedirectResult(hbAuth.auth)
        .then((result) => {
            if (!result) {
                return;
            }

            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential?.accessToken;

            // The signed-in user info.
            const userData = getUserDataFromUser(result.user);
            currentUserChanged(userData);

        }).catch((error) => {
            // todo: feedback
            alert(`Sign in error: ${error.message}`);
        });
};


const getUserDataFromUser = (user:User):IUserData => {
    return {
        isAuthenticated: true,
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerDisplayName: user.displayName
    };
};


const currentUserChanged = (userData:IUserData) => {
    userData.isAuthenticated ?
        document.removeEventListener("keydown", listenForSignInEvent) :
        document.addEventListener("keydown", listenForSignInEvent);
    dispatchCurrentUserChangedEvent(userData);
};


const listenForSignInEvent = (event:KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        signInWithRedirect(getAuth(FbApp.current), new GoogleAuthProvider());
    }
};

const dispatchCurrentUserChangedEvent = (detail:IUserData) =>
    window.dispatchEvent(new CustomEvent("hb-current-user-changed", { detail }));
