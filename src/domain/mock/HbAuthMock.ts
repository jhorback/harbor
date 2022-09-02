import { IUserAuth, IUserAuthKey, IUserData } from "../interfaces/UserInterfaces";
import {provides} from "../DependencyContainer/decorators";



@provides<IUserAuth>(IUserAuthKey)
class HbAutMock implements IUserAuth {

    connected:Boolean = false;

    connect(): void {
        if (this.connected) {
            return;
        }

        setupAuthListener();
        this.connected = true; 
    }

    signOut(): Promise<void> {
        return new Promise((resolve) => {
            signOut();
            resolve();
        });
    }
}


const signOut = () => {
    dispatchCurrentUserChangedEvent({
        isAuthenticated: false,
        uid: "",
        displayName: "",
        permissions: {
            isAuthor: false,
            isSysAdmin: false
        }
    });
};

const setupAuthListener = () => {
    dispatchCurrentUserChangedEvent({
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
}


const dispatchCurrentUserChangedEvent = (detail:IUserData) =>
    window.dispatchEvent(new CustomEvent("hb-current-user-changed", { detail }));
