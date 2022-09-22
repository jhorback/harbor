import { IUserAuth, UserAuthKey, IUserData } from "./interfaces/UserInterfaces";
import { provides } from "./DependencyContainer/decorators";
import { FbApp } from "./FbApp";
import { HbApp } from "./HbApp";
import { sendFeedback } from "../common/feedback";
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
import { HbDb } from "./HbDb";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { UserModel } from "./User/UserModel";
import { UserRole } from "./User/UserRoles";


@provides<IUserAuth>(UserAuthKey, !HbApp.isStorybook)
class HbAuth implements IUserAuth {

    provider:GoogleAuthProvider;

    auth:Auth;

    connected:Boolean = false;

    constructor() {
        this.provider = new GoogleAuthProvider();
        this.auth = getAuth(FbApp.current);
    }

    /**
     * Sets up the Google auth listener / handles sign in.
     */
    connect(): void {
        if (this.connected) {
            return;
        }

        setupAuthListener(this);
        this.connected = true; 
    }

    /**
     * Signs the user out
     */
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

    onAuthStateChanged(hbAuth.auth, async (user) => {
        
        const userData:IUserData = user ? getUserDataFromAuthUser(user) : {
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
            catch(error:any) {
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



const getUserDataFromAuthUser = (user:User):IUserData => ({
    isAuthenticated: true,
    uid: user.uid,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
});



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


const getSignedInUser = async (authUser:User):Promise<IUserData> => {
    const docRef = doc(HbDb.current, "users", authUser.uid).withConverter<IUserData>(UserModel);
    const docSnap = await getDoc(docRef);
    let user:IUserData;

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

    } else {
        user = docSnap.data() as IUserData;
        
        // trigger now before update
        currentUserChanged(user);

        user.lastLogin = new Date();
        await updateDoc(docRef, {
            lastLogin: user.lastLogin
        });
    }

    return user;
}