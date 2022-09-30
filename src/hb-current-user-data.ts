import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { IUserData, IHbAppInfo, IUserAuth, UserAuthKey } from "./domain/interfaces/UserInterfaces";
import { HbApp } from "./domain/HbApp";
import { inject } from "./domain/DependencyContainer/decorators";
import { sendFeedback } from "./layout/feedback";
import "./domain/HbAuth";
import { HbCurrentUserChangedEvent } from "./domain/HbAuth";


export class SignOutEvent extends Event {
    static eventType = "sign-out";
    constructor() {
        super(SignOutEvent.eventType, {bubbles: true, composed: true});
    }
}

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

    @dataProperty({changeEvent: "current-user-changed"})
    currentUser:IUserData = CurrentUserData.defaultCurrentUser;

    @dataProperty({changeEvent: "hb-app-info-changed"})
    hbAppInfo:IHbAppInfo = CurrentUserData.defaultHbAppInfo;

    @inject<IUserAuth>(UserAuthKey)
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

    @event(HbCurrentUserChangedEvent.eventType)
    private hbCurrentUserChanged(event:HbCurrentUserChangedEvent) {
        StateChange.of(this, "currentUser")
            .next(setCurrentUserData(event.userData))
            .dispatch();
    }

    @event(SignOutEvent.eventType)
    private async signOut(event:SignOutEvent) {
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

