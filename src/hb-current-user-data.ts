import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { IUserData, IHbAppInfo, IUserAuth, IUserAuthKey } from "./domain/interfaces/UserInterfaces";
import { HbApp } from "./domain/HbApp";
import { inject } from "./domain/DependencyContainer/decorators";
import { sendFeedback } from "./common/feedback";
import "./domain/HbAuth";


@customDataElement("hb-current-user-data", {
    eventsListenAt: "window"
})
export class CurrentUserData extends DataElement {
    static defaultCurrentUser:IUserData = {
        isAuthenticated: false,
        uid: "",
        displayName: ""
    };

    static defaultHbAppInfo:IHbAppInfo = {
        version: "v0.0.0"
    };

    static signOutEvent = () =>
        new Event("sign-out", { bubbles: true, composed: true});

    @dataProperty({changeEvent: "current-user-changed"})
    currentUser:IUserData = CurrentUserData.defaultCurrentUser;

    @dataProperty({changeEvent: "hb-app-info-changed"})
    hbAppInfo:IHbAppInfo = CurrentUserData.defaultHbAppInfo;

    @inject<IUserAuth>(IUserAuthKey)
    private userAuth!:IUserAuth;

    connectedCallback() {
        super.connectedCallback();
        this.userAuth.connect();
        this.setHbAppInfo();
    }

    private setHbAppInfo() {
        StateChange.of(this, "hbAppInfo")
            .next(setAppVersion)
            .dispatch();
    }

    @event("hb-current-user-changed")
    private hbCurrentUserChanged(event:CustomEvent) {
        StateChange.of(this, "currentUser")
            .next(setCurrentUserData(event.detail))
            .dispatch();
    }

    @event("sign-out")
    private async signOut(event:Event) {
        try{
            await this.userAuth.signOut();
        } catch (e:any) {
            sendFeedback({ message: e.message });
        }
    }
}


const setCurrentUserData = (userData:IUserData) => (state:IUserData) => {
    state.isAuthenticated = userData.isAuthenticated;
    state.email = userData.email;
    state.photoURL = userData.photoURL;
    state.displayName = userData.displayName;
    state.uid = userData.uid;
    state.firstLogin = userData.firstLogin;
    state.lastLogin = userData.lastLogin;
    state.role = userData.role;
};

const setAppVersion = (state:IHbAppInfo) => {
    state.version = `v${HbApp.version}`;
};

