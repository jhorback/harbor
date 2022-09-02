var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IUserAuthKey } from "./interfaces/UserInterfaces";
import { provides } from "./DependencyContainer/decorators";
import { FbApp } from "./FbApp";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
let HbAuth = class HbAuth {
    constructor() {
        this.connected = false;
        this.provider = new GoogleAuthProvider();
        this.auth = getAuth(FbApp.current);
    }
    connect() {
        if (this.connected) {
            return;
        }
        setupAuthListener(this);
        this.connected = true;
    }
    async signOut() {
        return new Promise((resolve, reject) => {
            signOut(this.auth).then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            });
        });
    }
};
HbAuth = __decorate([
    provides(IUserAuthKey)
], HbAuth);
const setupAuthListener = (hbAuth) => {
    onAuthStateChanged(hbAuth.auth, (user) => {
        // harbor #10
        // dispatch event first then
        // need to load user from the database and
        // insert if not there
        // need to set firstLogin, lastLogin, and permissions
        const userData = user ? {
            isAuthenticated: true,
            uid: user.uid,
            displayName: user.displayName,
            email: user.email,
            photoURL: user.photoURL,
            providerDisplayName: user.displayName,
            permissions: {
                isAuthor: false,
                isSysAdmin: false
            }
        } : {
            isAuthenticated: false,
            uid: "",
            displayName: "",
            permissions: {
                isAuthor: false,
                isSysAdmin: false
            }
        };
        dispatchCurrentUserChangedEvent(userData);
    });
};
const dispatchCurrentUserChangedEvent = (detail) => window.dispatchEvent(new CustomEvent("hb-current-user-changed", { detail }));
/// TEST CODE
// import {
//     getAuth,
//     signInWithPopup,
//     GoogleAuthProvider,
//     signInWithRedirect,
//     signOut,
//     onAuthStateChanged
// } from "firebase/auth";
// import {FbApp} from "./FbApp";
/**
 * // todo: remove GoogleAuth after HbAuth is finished
 * Reference:
 * https://firebase.google.com/docs/auth/web/google-signin?authuser=0&hl=en
 */
/**
 *
 */
export const signin = () => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth(FbApp.current);
    console.log("AUTH BEFORE SIGNUP", auth);
    if (auth.currentUser !== null) {
        console.log(auth.currentUser.email);
        console.log("RETURNING");
        return;
    }
    // signInWithRedirect(auth, provider);
    /*
    getRedirectResult(auth)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access Google APIs.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            // The signed-in user info.
            const user = result.user;
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });
        */
    // signInWithPopup(auth, provider)
    //     .then((result) => {
    //         // This gives you a Google Access Token. You can use it to access the Google API.
    //         const credential = GoogleAuthProvider.credentialFromResult(result);
    //         const token = credential?.accessToken;
    //         // The signed-in user info.
    //         const user = result.user;
    //         console.log(user);
    //         // ...
    //     }).catch((error) => {
    //         // Handle Errors here.
    //         const errorCode = error.code;
    //         const errorMessage = error.message;
    //         // The email of the user's account used.
    //         const email = error.customData.email;
    //         // The AuthCredential type that was used.
    //         const credential = GoogleAuthProvider.credentialFromError(error);
    //         // ...
    //     });
};
