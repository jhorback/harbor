import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { IUserData, IUserListRepo, UserListRepoKey } from "../../domain/interfaces/UserInterfaces";
import { inject } from "../../domain/DependencyContainer/decorators";
import { sendFeedback } from "../../common/feedback";
import "../../domain/User/HbUserListRepo";
import { UserRole } from "../../domain/User/UserRoles";


export interface IUserListData {
    list: Array<IUserData>;
    count: Number;
}

export class RequestUserListEvent extends Event {
    static eventType = "request-user-list";
    constructor() {
        super(RequestUserListEvent.eventType, { bubbles: true });
    }
}

export class UpdateUserRoleEvent extends Event {
    static eventType = "update-user-role";
    uid:string;
    role:UserRole;
    constructor(uid:string, role:UserRole) {
        super(UpdateUserRoleEvent.eventType, { bubbles: true, composed: true });
        this.uid = uid;
        this.role = role;
    }
}


@customDataElement("hb-user-list-data", {
    eventsListenAt: "parent"
})
export class UserListData extends DataElement {
    static defaultUsers:IUserListData = {
        list: [],
        count: 0
    };
    
    @dataProperty({changeEvent: "users-changed"})
    users:IUserListData = UserListData.defaultUsers;

    @inject<IUserListRepo>(UserListRepoKey)
    private userList!:IUserListRepo;

    @event(RequestUserListEvent.eventType)
    async getUserList(event:RequestUserListEvent) {
        StateChange.of(this, "users")
            .tap(requestUsers(this.userList));
    }

    @event(UpdateUserRoleEvent.eventType)
    async updateUserRole(event:UpdateUserRoleEvent) {
        StateChange.of(this, "users")
            .tap(updateUserRole(this.userList, event.uid, event.role));
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