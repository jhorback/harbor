var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CurrentUserData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { IUserAuthKey } from "./domain/interfaces/UserInterfaces";
import { HbApp } from "./domain/HbApp";
import { inject } from "./domain/DependencyContainer/decorators";
import "./domain/HbAuth";
let CurrentUserData = CurrentUserData_1 = class CurrentUserData extends DataElement {
    constructor() {
        super(...arguments);
        this.currentUser = CurrentUserData_1.defaultCurrentUser;
        this.hbAppInfo = CurrentUserData_1.defaultHbAppInfo;
    }
    connectedCallback() {
        super.connectedCallback();
        this.userAuth.connect();
        this.setHbAppInfo();
    }
    setHbAppInfo() {
        StateChange.of(this, "hbAppInfo")
            .next(setAppVersion)
            .dispatch();
    }
    hbCurrentUserChanged(event) {
        StateChange.of(this, "currentUser")
            .next(setCurrentUserData(event.detail))
            .dispatch();
    }
    async signOut(event) {
        alert("signOut called");
        try {
            await this.userAuth.signOut();
        }
        catch (e) {
            // todo: feedback
            alert(e.message);
        }
    }
};
CurrentUserData.defaultCurrentUser = {
    isAuthenticated: false,
    uid: "",
    displayName: "",
    permissions: {
        isAuthor: false,
        isSysAdmin: false
    }
};
CurrentUserData.defaultHbAppInfo = {
    version: "v0.0.0"
};
CurrentUserData.signOutEvent = () => new Event("sign-out", { bubbles: true, composed: true });
__decorate([
    dataProperty({ changeEvent: "current-user-changed" })
], CurrentUserData.prototype, "currentUser", void 0);
__decorate([
    dataProperty({ changeEvent: "hb-app-info-changed" })
], CurrentUserData.prototype, "hbAppInfo", void 0);
__decorate([
    inject(IUserAuthKey)
], CurrentUserData.prototype, "userAuth", void 0);
__decorate([
    event("hb-current-user-changed")
], CurrentUserData.prototype, "hbCurrentUserChanged", null);
__decorate([
    event("sign-out")
], CurrentUserData.prototype, "signOut", null);
CurrentUserData = CurrentUserData_1 = __decorate([
    customDataElement("hb-current-user-data", {
        eventsListenAt: "window"
    })
], CurrentUserData);
export { CurrentUserData };
const setCurrentUserData = (userData) => (state) => {
    state.isAuthenticated = userData.isAuthenticated;
    state.email = userData.email;
    state.permissions = userData.permissions;
    state.photoURL = userData.photoURL;
    state.displayName = userData.displayName;
    state.uid = userData.uid;
    state.firstLogin = userData.firstLogin;
    state.lastLogin = userData.lastLogin;
    state.providerDisplayName = userData.providerDisplayName;
};
const setAppVersion = (state) => {
    state.version = `v${HbApp.version}`;
};
