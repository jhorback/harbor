import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { sendFeedback } from "../../common/feedback";
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


@customDataElement("hb-system-admin-data", {
    eventsListenAt: "parent"
})
export class SystemAdminData extends DataElement {
    static defaultSettings:ISystemAdminData = {homePageThumbnail:null};

    static requestSysadminSettingsEvent = () =>
        new CustomEvent("request-sysadmin-settings", {bubbles:true});
    
    static updateHomePageEvent = (documentReference:IDocumentReference) =>
        new CustomEvent("update-home-page", {bubbles:true, composed:true, detail: documentReference});
    
    @dataProperty({changeEvent: "settings-changed"})
    settings:ISystemAdminData = SystemAdminData.defaultSettings;

    @inject<IHomePageRepo>(HomePageRepoKey)
    private homePageRepo!:IHomePageRepo;

    @event("request-sysadmin-settings")
    async requestSysadminSettings() {
        StateChange.of(this, "settings")
            .tap(requestSettings(this.homePageRepo));
    }

    @event("update-home-page")
    async updateHomePage(event:CustomEvent) {
        const docRef = event.detail as IDocumentReference;
        StateChange.of(this, "settings")
            .tap(updateHomePage(this.homePageRepo, docRef));
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