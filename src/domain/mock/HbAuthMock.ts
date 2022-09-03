import { IUserAuth, IUserAuthKey, IUserData } from "../interfaces/UserInterfaces";
import {provides} from "../DependencyContainer/decorators";



@provides<IUserAuth>(IUserAuthKey)
class HbAutMock implements IUserAuth {

    connect(): void {
        setupAuthListener();
    }

    signOut(): Promise<void> {
        return new Promise((resolve) => {
            signOut();
            resolve();
        });
    }
}


const signOut = () => {
    setCurrentUserAsUnAuthenticated();
};

const setupAuthListener = () => {
    setCurrentUserAsAuthenticated();
}


const setCurrentUserAsAuthenticated = () => {
    currentUserChanged({
        isAuthenticated: true,
        displayName: "John Horback",
        email: "jhorback@gmail.com",
        photoURL: "content/avatars/user1.png",
        uid: "mock-user-id",
        providerDisplayName: "John Horback",
        permissions: {
            isAuthor: false,
            isSysAdmin: false
        }
    });
};

const setCurrentUserAsUnAuthenticated = () => {
    currentUserChanged({
        isAuthenticated: false,
        uid: "",
        displayName: "",
        permissions: {
            isAuthor: false,
            isSysAdmin: false
        }
    });
};



const currentUserChanged = (userData:IUserData) => {
    userData.isAuthenticated ?
        document.removeEventListener("keydown", listenForSignInEvent) :
        document.addEventListener("keydown", listenForSignInEvent);
    dispatchCurrentUserChangedEvent(userData);
};


const listenForSignInEvent = (event:KeyboardEvent) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        setCurrentUserAsAuthenticated();
    }
};


const dispatchCurrentUserChangedEvent = (detail:IUserData) =>
    window.dispatchEvent(new CustomEvent("hb-current-user-changed", { detail }));

