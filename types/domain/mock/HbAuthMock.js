var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { UserAuthKey } from "../interfaces/UserInterfaces";
import { provides } from "../DependencyContainer/decorators";
import { UserRole } from "../User/UserRoles";
import { HbCurrentUserChangedEvent } from "../HbAuth";
let HbAutMock = class HbAutMock {
    connect() {
        setupAuthListener();
    }
    signOut() {
        return new Promise((resolve) => {
            signOut();
            resolve();
        });
    }
};
HbAutMock = __decorate([
    provides(UserAuthKey)
], HbAutMock);
const signOut = () => {
    setCurrentUserAsUnAuthenticated();
};
const setupAuthListener = () => {
    setCurrentUserAsAuthenticated();
};
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
const currentUserChanged = (userData) => {
    userData.isAuthenticated ?
        document.removeEventListener("keydown", listenForSignInEvent) :
        document.addEventListener("keydown", listenForSignInEvent);
    dispatchCurrentUserChangedEvent(userData);
};
const listenForSignInEvent = (event) => {
    if (event.ctrlKey && event.shiftKey && event.key === 'S') {
        setCurrentUserAsAuthenticated();
    }
};
const dispatchCurrentUserChangedEvent = (detail) => window.dispatchEvent(new HbCurrentUserChangedEvent(detail));
