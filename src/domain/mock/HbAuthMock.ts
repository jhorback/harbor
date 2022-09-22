import { IUserAuth, UserAuthKey, IUserData } from "../interfaces/UserInterfaces";
import {provides} from "../DependencyContainer/decorators";
import { UserRole } from "../User/UserRoles";
import { HbCurrentUserChangedEvent } from "../HbAuth";



@provides<IUserAuth>(UserAuthKey)
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
        role: UserRole.siteAdmin
    });
};

const setCurrentUserAsUnAuthenticated = () => {
    currentUserChanged({
        isAuthenticated: false,
        uid: "",
        displayName: ""
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
    window.dispatchEvent(new HbCurrentUserChangedEvent(detail));

