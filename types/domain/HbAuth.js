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
import { sendFeedback } from "../common/feedback";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, getRedirectResult, signInWithRedirect } from "firebase/auth";
import { HbDb } from "./HbDb";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserModel } from "./User/UserModel";
import { UserRole } from "./User/UserRoles";
let HbAuth = class HbAuth {
    constructor() {
        this.connected = false;
        this.provider = new GoogleAuthProvider();
        this.auth = getAuth(FbApp.current);
    }
    /**
     * Sets up the Google auth listener / handles sign in.
     */
    connect() {
        if (this.connected) {
            return;
        }
        setupAuthListener(this);
        this.connected = true;
    }
    /**
     * Signs the user out
     */
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
    onAuthStateChanged(hbAuth.auth, async (user) => {
        const userData = user ? getUserDataFromAuthUser(user) : {
            isAuthenticated: false,
            uid: "",
            displayName: ""
        };
        currentUserChanged(userData);
        if (user) {
            try {
                const dbUser = await getSignedInUser(user);
                currentUserChanged(dbUser);
            }
            catch (error) {
                sendFeedback({ message: `Get signed in user error: ${error.message}` });
            }
        }
    });
    getRedirectResult(hbAuth.auth)
        .then((result) => {
        if (!result) {
            return;
        }
        // The signed-in user info.
        const userData = getUserDataFromAuthUser(result.user);
        currentUserChanged(userData);
    }).catch((error) => {
        sendFeedback({ message: `Sign in error: ${error.message}` });
    });
};
const getUserDataFromAuthUser = (user) => ({
    isAuthenticated: true,
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
});
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
const getSignedInUser = async (authUser) => {
    const docRef = doc(HbDb.current, "users", authUser.uid).withConverter(UserModel);
    const docSnap = await getDoc(docRef);
    let user;
    if (!docSnap.exists()) {
        user = {
            isAuthenticated: true,
            email: authUser.email,
            photoURL: authUser.photoURL,
            displayName: authUser.displayName,
            uid: authUser.uid,
            firstLogin: new Date(),
            lastLogin: new Date(),
            role: UserRole.none
        };
        // trigger now before adding user
        currentUserChanged(user);
        await setDoc(doc(HbDb.current, "users", authUser.uid), user);
    }
    else {
        user = docSnap.data();
        // trigger now before update
        currentUserChanged(user);
        user.lastLogin = new Date();
        await updateDoc(docRef, {
            lastLogin: user.lastLogin
        });
    }
    return user;
};
