var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SystemAdminData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { sendFeedback } from "../../layout/feedback";
import { inject } from "../../domain/DependencyContainer/decorators";
import { HomePageRepoKey } from "../../domain/interfaces/DocumentInterfaces";
export class RequestSysadminSettingsEvent extends Event {
    constructor() {
        super(RequestSysadminSettingsEvent.eventType, { bubbles: true });
    }
    static { this.eventType = "request-sysadmin-settings"; }
}
export class UpdateHomePageEvent extends Event {
    constructor(documentReference) {
        super(UpdateHomePageEvent.eventType, { bubbles: true, composed: true });
        this.documentReference = documentReference;
    }
    static { this.eventType = "update-home-page"; }
}
let SystemAdminData = SystemAdminData_1 = class SystemAdminData extends DataElement {
    constructor() {
        super(...arguments);
        this.settings = SystemAdminData_1.defaultSettings;
    }
    static { this.defaultSettings = { homePageThumbnail: null }; }
    async requestSysadminSettings(event) {
        StateChange.of(this, "settings")
            .tap(requestSettings(this.homePageRepo));
    }
    async updateHomePage(event) {
        StateChange.of(this, "settings")
            .tap(updateHomePage(this.homePageRepo, event.documentReference));
    }
};
__decorate([
    dataProperty({ changeEvent: "settings-changed" })
], SystemAdminData.prototype, "settings", void 0);
__decorate([
    inject(HomePageRepoKey)
], SystemAdminData.prototype, "homePageRepo", void 0);
__decorate([
    event(RequestSysadminSettingsEvent.eventType)
], SystemAdminData.prototype, "requestSysadminSettings", null);
__decorate([
    event(UpdateHomePageEvent.eventType)
], SystemAdminData.prototype, "updateHomePage", null);
SystemAdminData = SystemAdminData_1 = __decorate([
    customDataElement("hb-system-admin-data", {
        eventsListenAt: "parent"
    })
], SystemAdminData);
export { SystemAdminData };
const updateHomePage = (homePageRepo, docRef) => async (stateChange) => {
    await homePageRepo.setHomePage(docRef);
    stateChange.tap(requestSettings(homePageRepo));
    sendFeedback({
        message: "The home page has been updated"
    });
};
const requestSettings = (homePageRepo) => async (stateChange) => {
    const thumbnail = await homePageRepo.getHomePageThumbnail();
    stateChange
        .next(updateThumbnail(thumbnail))
        .dispatch();
};
const updateThumbnail = (thumbnail) => (state) => {
    state.homePageThumbnail = thumbnail;
};
