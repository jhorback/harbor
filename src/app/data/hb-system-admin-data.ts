import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { IDocumentThumbnail, IHomePageRepo, IHomePageRepoKey } from "../../domain/interfaces/DocumentInterfaces";
import "./HbUserListRepo";



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
    
    static updateHomePageEvent = (uid:string) =>
        new CustomEvent("update-home-page", {bubbles:true, composed:true, detail: {/** fill this out */}});
    
    @dataProperty({changeEvent: "settings-changed"})
    settings:ISystemAdminData = SystemAdminData.defaultSettings;

    @inject<IHomePageRepo>(IHomePageRepoKey)
    private homePageRepo!:IHomePageRepo;

    @event("request-sysadmin-settings")
    async requestSysadminSettings() {
        StateChange.of(this, "settings")
            .tap(requestSettings(this.homePageRepo));
    }

    @event("update-home-page")
    async updateHomePage(event:CustomEvent) {
        // todo: update home page
    }
}



const requestSettings = (homePageRepo:IHomePageRepo) => async (stateChange:StateChange) => {
    const thumbnail = await homePageRepo.getHomePageThumbnail();
    stateChange
        .next(updateThumbnail(thumbnail))
        .dispatch();
};

const updateThumbnail = (thumbnail:IDocumentThumbnail|null) => (state:ISystemAdminData) => {
    state.homePageThumbnail = thumbnail;
};