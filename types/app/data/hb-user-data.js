var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { UserListRepoKey } from "../../domain/interfaces/UserInterfaces";
let UserData = UserData_1 = class UserData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = UserData_1.defaultState;
    }
    get uid() { return this.getAttribute("uid") || ""; }
    set uid(uid) { this.setAttribute("uid", uid); }
    connectedCallback() {
        super.connectedCallback();
        StateChange.of(this)
            .tap(requestUser(this.userListRepo, this.uid));
    }
};
UserData.defaultState = {
    isLoaded: false,
    user: {
        isAuthenticated: false,
        displayName: ""
    }
};
__decorate([
    dataProperty()
], UserData.prototype, "state", void 0);
__decorate([
    inject(UserListRepoKey)
], UserData.prototype, "userListRepo", void 0);
UserData = UserData_1 = __decorate([
    customDataElement("hb-user-data", {
        eventsListenAt: "self",
        stateIdProperty: "uid"
    })
], UserData);
export { UserData };
const requestUser = (userListRepo, uid) => async (stateChange) => {
    const userData = await userListRepo.getUser(uid);
    stateChange
        .next(updateIsLoaded(true))
        .next(updateUser(userData))
        .dispatch();
};
const updateIsLoaded = (isLoaded) => (state) => {
    state.isLoaded = isLoaded;
};
const updateUser = (userData) => (state) => {
    state.user = userData || UserData.defaultState.user;
};
