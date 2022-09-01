import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import "./domain/HbAuth";
import { IUserData, IHbAppInfo, IUserAuth, IUserAuthKey } from "./domain/interfaces/UserInterfaces";
import { HbApp } from "./domain/HbApp";
import dc from "./domain/DependencyContainer";



@customDataElement("hb-current-user-data", {
    eventsListenAt: "window"
})
export class CurrentUserData extends DataElement {
    static defaultCurrentUser:IUserData = {
        uid: "",
        displayName: "",        
        permissions: {
            isAuthor: false,
            isSysAdmin: false
        }
    };

    static defaultHbAppInfo:IHbAppInfo = {
        version: "v0.0.0"
    };

    @dataProperty({changeEvent: "current-user-changed"})
    currentUser:IUserData = CurrentUserData.defaultCurrentUser;

    @dataProperty({changeEvent: "hb-app-info-changed"})
    hbAppInfo:IHbAppInfo = CurrentUserData.defaultHbAppInfo;

    private userAuth:IUserAuth;

    constructor() {
        super();
        this.userAuth = dc.get<IUserAuth>(IUserAuthKey);
        this.userAuth.connect();
    }

    connectedCallback() {
        super.connectedCallback();
        this.setHbAppInfo();        
    }

    private setHbAppInfo() {
        StateChange.of(this, "hbAppInfo")
            .next(setAppVersion)
            .dispatch();
    }
}


const setAppVersion = (state:IHbAppInfo) => {
    state.version = `v${HbApp.version}`;
};

