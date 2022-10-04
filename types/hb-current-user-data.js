var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var CurrentUserData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { UserAuthKey } from "./domain/interfaces/UserInterfaces";
import { HbApp } from "./domain/HbApp";
import { inject } from "./domain/DependencyContainer/decorators";
import { sendFeedback } from "./layout/feedback";
import "./domain/HbAuth";
import { HbCurrentUserChangedEvent } from "./domain/HbAuth";
export class SignOutEvent extends Event {
    constructor() {
        super(SignOutEvent.eventType, { bubbles: true, composed: true });
    }
}
SignOutEvent.eventType = "sign-out";
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
            .next(setCurrentUserData(event.userData))
            .dispatch();
    }
    async signOut(event) {
        try {
            await this.userAuth.signOut();
        }
        catch (e) {
            sendFeedback({ message: e.message });
        }
    }
};
CurrentUserData.defaultCurrentUser = {
    isAuthenticated: false,
    uid: "",
    displayName: ""
};
CurrentUserData.defaultHbAppInfo = {
    version: "v0.0.0"
};
__decorate([
    dataProperty({ changeEvent: "current-user-changed" })
], CurrentUserData.prototype, "currentUser", void 0);
__decorate([
    dataProperty({ changeEvent: "hb-app-info-changed" })
], CurrentUserData.prototype, "hbAppInfo", void 0);
__decorate([
    inject(UserAuthKey)
], CurrentUserData.prototype, "userAuth", void 0);
__decorate([
    event(HbCurrentUserChangedEvent.eventType)
], CurrentUserData.prototype, "hbCurrentUserChanged", null);
__decorate([
    event(SignOutEvent.eventType)
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
    state.photoURL = userData.photoURL;
    state.displayName = userData.displayName;
    state.uid = userData.uid;
    state.firstLogin = userData.firstLogin;
    state.lastLogin = userData.lastLogin;
    state.role = userData.role;
};
const setAppVersion = (state) => {
    state.version = `v${HbApp.version}`;
};
