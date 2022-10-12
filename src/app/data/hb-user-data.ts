import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { IUserData, IUserListRepo, UserListRepoKey } from "../../domain/interfaces/UserInterfaces";


export interface IUserDataState {
    isLoaded: boolean;
    user:IUserData
}


@customDataElement("hb-user-data", {
    eventsListenAt: "self",
    stateIdProperty: "uid"
})
export class UserData extends DataElement {
    static defaultState:IUserDataState = {
        isLoaded: false,
        user: {
            isAuthenticated: false,
            displayName: ""
        }
    };

    get uid():string { return this.getAttribute("uid") || ""; }
    set uid(uid:string) { this.setAttribute("uid", uid); }

    connectedCallback(): void {
        super.connectedCallback();
        StateChange.of(this)
            .tap(requestUser(this.userListRepo, this.uid));
    }
    
    @dataProperty()
    state:IUserDataState = UserData.defaultState;

    @inject<IUserListRepo>(UserListRepoKey)
    private userListRepo!:IUserListRepo;
}


const requestUser = (userListRepo:IUserListRepo, uid:string) => async (stateChange:StateChange) => {
    const userData = await userListRepo.getUser(uid);
    stateChange
        .next(updateIsLoaded(true))
        .next(updateUser(userData))
        .dispatch();
};

const updateIsLoaded = (isLoaded:boolean) => (state:IUserDataState) => {
    state.isLoaded = isLoaded;
};

const updateUser = (userData:IUserData|null) => (state:IUserDataState) => {
    state.user = userData || UserData.defaultState.user;
};