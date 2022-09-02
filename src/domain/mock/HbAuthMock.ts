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
}


const setupAuthListener = () => {
    window.dispatchEvent(new CustomEvent("hb-current-user-changed", {
        detail: {
            displayName: "John Horback",
            email: "jhorback@gmail.com",
            photoURL: "content/avatars/user1.png",
            appVersion: "v0.1.0",
            uid: "mock-user-id",
            providerDisplayName: "John Horback",
            permissions: {
                isAuthor: false,
                isSysAdmin: false
            }
        }
    }));
}