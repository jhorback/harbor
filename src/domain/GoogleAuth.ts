import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithRedirect,
    signOut,
    onAuthStateChanged
} from "firebase/auth";

/**
 * Reference:
 * https://firebase.google.com/docs/auth/web/google-signin?authuser=0&hl=en
 */


/**
 * 
 */
export const signin = () => {
    
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    console.log("AUTH BEFORE SIGNUP", auth);
    if (auth.currentUser !== null) {
        console.log(auth.currentUser.email);
        console.log("RETURNING");
        return;
    }

    // get currently signed in user
    onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in, see docs for a list of available properties
          // https://firebase.google.com/docs/reference/js/firebase.User
          const uid = user.uid;
          console.log("LOGGED IN", user.email, user);
          // ...
        } else {
            console.log("NOT LOGGED IN");
          // User is signed out
          // ...
        }
      });

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
