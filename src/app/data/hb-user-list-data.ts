import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { IUserData, IUserListRepo, IUserListRepoKey } from "../../domain/interfaces/UserInterfaces";
import { inject } from "../../domain/DependencyContainer/decorators";
import { sendFeedback } from "../../common/feedback";
import "../../domain/User/HbUserListRepo";
import { UserRole } from "../../domain/User/UserRoles";


export interface IUserListData {
    list: Array<IUserData>;
    count: Number;
}


@customDataElement("hb-user-list-data", {
    eventsListenAt: "parent"
})
export class UserListData extends DataElement {
    static defaultUsers:IUserListData = {
        list: [],
        count: 0
    };

    static requestUserListEvent = () =>
        new CustomEvent("request-user-list", {bubbles:true});
    
    static updateUserRoleEvent = (uid:string, role:UserRole) =>
        new CustomEvent("update-user-role", {bubbles:true, composed:true, detail: {uid, role}});
    
    @dataProperty({changeEvent: "users-changed"})
    users:IUserListData = UserListData.defaultUsers;

    @inject<IUserListRepo>(IUserListRepoKey)
    private userList!:IUserListRepo;

    @event("request-user-list")
    async getUserList() {
        StateChange.of(this, "users")
            .tap(requestUsers(this.userList));
    }

    @event("update-user-role")
    async updateUserRole(event:CustomEvent) {
        const uid = event.detail.uid as string;
        const role = event.detail.role as UserRole;
        StateChange.of(this, "users")
            .tap(updateUserRole(this.userList, uid, role));
    }
}



const updateUserRole = (userList:IUserListRepo, uid:string, role:UserRole) => async (stateChange:StateChange) => {
    await userList.updateUserRole(uid, role);
    sendFeedback({message: "The user role has been updated"});
    stateChange.tap(requestUsers(userList));
};

const requestUsers = (userList:IUserListRepo) => async (stateChange:StateChange) => {
    const users = await userList.getUsers();
    stateChange
        .next(updateUserList(users))
        .dispatch();
};

const updateUserList = (users:Array<IUserData>) => (state:IUserListData) => {
    state.list = users;
    state.count = users.length;
};