import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { sendFeedback } from "../../layout/feedback";
import { inject } from "../../domain/DependencyContainer/decorators";
import {
    IDocumentThumbnail,
    IHomePageRepo,
    HomePageRepoKey,
    IDocumentReference
} from "../../domain/interfaces/DocumentInterfaces";


export interface ISystemAdminData {
    homePageThumbnail: IDocumentThumbnail|null;
}

export class RequestSysadminSettingsEvent extends Event {
    static eventType = "request-sysadmin-settings";
    constructor() {
        super(RequestSysadminSettingsEvent.eventType, { bubbles: true });
    }
}

export class UpdateHomePageEvent extends Event {
    static eventType = "update-home-page";
    documentReference:IDocumentReference;
    constructor(documentReference:IDocumentReference) {
        super(UpdateHomePageEvent.eventType, { bubbles: true, composed: true});
        this.documentReference = documentReference;
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
            .tap(updateHomePage(this.homePageRepo, event.documentReference));
    }
}


const updateHomePage = (homePageRepo:IHomePageRepo, docRef:IDocumentReference) => async (stateChange:StateChange) => {
    await homePageRepo.setHomePage(docRef);    
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

const updateThumbnail = (thumbnail:IDocumentThumbnail|null) => (state:ISystemAdminData) => {
    state.homePageThumbnail = thumbnail;
};