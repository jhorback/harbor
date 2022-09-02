import { IUserAuth, IUserAuthKey, IUserData } from "./interfaces/UserInterfaces";
import { provides } from "./DependencyContainer/decorators";
import {FbApp} from "./FbApp";
import {
    getAuth,
    GoogleAuthProvider,
    Auth,
    onAuthStateChanged
} from "firebase/auth";


@provides<IUserAuth>(IUserAuthKey)
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
}



const setupAuthListener = (hbAuth:HbAuth) => {

    onAuthStateChanged(hbAuth.auth, (user) => {
        
        // harbor #10
        // dispatch event first then
        // need to load user from the database and
        // insert if not there
        // need to set firstLogin, lastLogin, and permissions

        const userData:IUserData = user ? {
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
            uid: "",
            displayName: "",
            permissions: {
                isAuthor: false,
                isSysAdmin: false
            }
        };

        window.dispatchEvent(new CustomEvent("hb-current-user-changed", {
            detail: userData
        }));
    });
};




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

   

    // signOut(auth).then(() => {
    //     // Sign-out successful.
    //   }).catch((error) => {
    //     // An error happened.
    //   });

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
