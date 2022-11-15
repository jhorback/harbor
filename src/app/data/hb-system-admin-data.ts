import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import {
    HomePageRepoKey, IHomePageRepo
} from "../../domain/interfaces/DocumentInterfaces";
import { IPageReference, IPageThumbnail } from "../../domain/interfaces/PageInterfaces";
import { sendFeedback } from "../../layout/feedback";


export interface ISystemAdminData {
    homePageThumbnail: IPageThumbnail|null;
}

export class RequestSysadminSettingsEvent extends Event {
    static eventType = "request-sysadmin-settings";
    constructor() {
        super(RequestSysadminSettingsEvent.eventType, { bubbles: true });
    }
}

export class UpdateHomePageEvent extends Event {
    static eventType = "update-home-page";
    pageReference:IPageReference;
    constructor(pageReference:IPageReference) {
        super(UpdateHomePageEvent.eventType, { bubbles: true, composed: true});
        this.pageReference = pageReference;
    }
}

@customDataElement("hb-system-admin-data", {
    eventsListenAt: "parent"
})
export class SystemAdminData extends DataElement {
    static defaultSettings:ISystemAdminData = {homePageThumbnail:null};
    
    @dataProperty({changeEvent: "settings-changed"})
    settings:ISystemAdminData = SystemAdminData.defaultSettings;

    @inject<IHomePageRepo>(HomePageRepoKey)
    private homePageRepo!:IHomePageRepo;

    @event(RequestSysadminSettingsEvent.eventType)
    async requestSysadminSettings(event: RequestSysadminSettingsEvent) {
        StateChange.of(this, "settings")
            .tap(requestSettings(this.homePageRepo));
    }

    @event(UpdateHomePageEvent.eventType)
    async updateHomePage(event:UpdateHomePageEvent) {
        StateChange.of(this, "settings")
            .tap(updateHomePage(this.homePageRepo, event.pageReference));
    }
}


const updateHomePage = (homePageRepo:IHomePageRepo, pageRef:IPageReference) => async (stateChange:StateChange) => {
    await homePageRepo.setHomePage(pageRef);    
    stateChange.tap(requestSettings(homePageRepo));
    sendFeedback({
        message: "The home page has been updated"
    });
};

const requestSettings = (homePageRepo:IHomePageRepo) => async (stateChange:StateChange) => {
    const thumbnail = await homePageRepo.getHomePageThumbnail();
    stateChange
        .next(updateThumbnail(thumbnail))
        .dispatch();
};

const updateThumbnail = (thumbnail:IPageThumbnail|null) => (state:ISystemAdminData) => {
    state.homePageThumbnail = thumbnail;
};