var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var UserListData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { UserListRepoKey } from "../../domain/interfaces/UserInterfaces";
import { inject } from "../../domain/DependencyContainer/decorators";
import { sendFeedback } from "../../layout/feedback";
import "../../domain/User/HbUserListRepo";
export class RequestUserListEvent extends Event {
    constructor() {
        super(RequestUserListEvent.eventType, { bubbles: true });
    }
}
RequestUserListEvent.eventType = "request-user-list";
export class UpdateUserRoleEvent extends Event {
    constructor(uid, role) {
        super(UpdateUserRoleEvent.eventType, { bubbles: true, composed: true });
        this.uid = uid;
        this.role = role;
    }
}
UpdateUserRoleEvent.eventType = "update-user-role";
let UserListData = UserListData_1 = class UserListData extends DataElement {
    constructor() {
        super(...arguments);
        this.users = UserListData_1.defaultUsers;
    }
    async getUserList(event) {
        StateChange.of(this, "users")
            .tap(requestUsers(this.userList));
    }
    async updateUserRole(event) {
        StateChange.of(this, "users")
            .tap(updateUserRole(this.userList, event.uid, event.role));
    }
};
UserListData.defaultUsers = {
    list: [],
    count: 0
};
__decorate([
    dataProperty({ changeEvent: "users-changed" })
], UserListData.prototype, "users", void 0);
__decorate([
    inject(UserListRepoKey)
], UserListData.prototype, "userList", void 0);
__decorate([
    event(RequestUserListEvent.eventType)
], UserListData.prototype, "getUserList", null);
__decorate([
    event(UpdateUserRoleEvent.eventType)
], UserListData.prototype, "updateUserRole", null);
UserListData = UserListData_1 = __decorate([
    customDataElement("hb-user-list-data", {
        eventsListenAt: "parent"
    })
], UserListData);
export { UserListData };
const updateUserRole = (userList, uid, role) => async (stateChange) => {
    await userList.updateUserRole(uid, role);
    sendFeedback({ message: "The user role has been updated" });
    stateChange.tap(requestUsers(userList));
};
const requestUsers = (userList) => async (stateChange) => {
    const users = await userList.getUsers();
    stateChange
        .next(updateUserList(users))
        .dispatch();
};
const updateUserList = (users) => (state) => {
    state.list = users;
    state.count = users.length;
};
