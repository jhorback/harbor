var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IUserAuthKey } from "../interfaces/UserInterfaces";
import { provides } from "../DependencyContainer/decorators";
let HbAutMock = class HbAutMock {
    constructor() {
        this.connected = false;
    }
    connect() {
        if (this.connected) {
            return;
        }
        setupAuthListener();
        this.connected = true;
    }
    signOut() {
        return new Promise((resolve) => {
            signOut();
            resolve();
        });
    }
};
HbAutMock = __decorate([
    provides(IUserAuthKey)
], HbAutMock);
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
};
const dispatchCurrentUserChangedEvent = (detail) => window.dispatchEvent(new CustomEvent("hb-current-user-changed", { detail }));
