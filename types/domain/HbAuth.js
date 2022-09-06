var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IUserAuthKey } from "./interfaces/UserInterfaces";
import { provides } from "./DependencyContainer/decorators";
import { FbApp } from "./FbApp";
import { HbApp } from "./HbApp";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, getRedirectResult, signInWithRedirect } from "firebase/auth";
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
    provides(IUserAuthKey, !HbApp.isStorybook)
], HbAuth);
const setupAuthListener = (hbAuth) => {
    onAuthStateChanged(hbAuth.auth, (user) => {
        // harbor #10
        // dispatch event first then
        // need to load user from the database and
        // insert if not there
        // need to set firstLogin, lastLogin, and role
        const userData = user ? getUserDataFromUser(user) : {
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
const getUserDataFromUser = (user) => {
    return {
        isAuthenticated: true,
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        providerDisplayName: user.displayName
    };
};
const currentUserChanged = (userData) => {
    userData.isAuthenticated ?
        document.removeEventListener("keydown", listenForSignInEvent) :
        document.addEventListener("keydown", listenForSignInEvent);
    dispatchCurrentUserChangedEvent(userData);
};
const listenForSignInEvent = (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        signInWithRedirect(getAuth(FbApp.current), new GoogleAuthProvider());
    }
};
const dispatchCurrentUserChangedEvent = (detail) => window.dispatchEvent(new CustomEvent("hb-current-user-changed", { detail }));
