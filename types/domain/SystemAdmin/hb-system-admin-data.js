var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SystemAdminData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { IHomePageRepoKey } from "../interfaces/DocumentInterfaces";
import "./HbUserListRepo";
let SystemAdminData = SystemAdminData_1 = class SystemAdminData extends DataElement {
    constructor() {
        super(...arguments);
        this.settings = SystemAdminData_1.defaultSettings;
    }
    async requestSysadminSettings() {
        StateChange.of(this, "settings")
            .tap(requestSettings(this.homePageRepo));
    }
    async updateHomePage(event) {
        // todo: update home page
    }
};
SystemAdminData.defaultSettings = { homePageThumbnail: null };
SystemAdminData.requestSysadminSettingsEvent = () => new CustomEvent("request-sysadmin-settings", { bubbles: true });
SystemAdminData.updateHomePageEvent = (uid) => new CustomEvent("update-home-page", { bubbles: true, composed: true, detail: { /** fill this out */} });
__decorate([
    dataProperty({ changeEvent: "settings-changed" })
], SystemAdminData.prototype, "settings", void 0);
__decorate([
    inject(IHomePageRepoKey)
], SystemAdminData.prototype, "homePageRepo", void 0);
__decorate([
    event("request-sysadmin-settings")
], SystemAdminData.prototype, "requestSysadminSettings", null);
__decorate([
    event("update-home-page")
], SystemAdminData.prototype, "updateHomePage", null);
SystemAdminData = SystemAdminData_1 = __decorate([
    customDataElement("hb-system-admin-data", {
        eventsListenAt: "parent"
    })
], SystemAdminData);
export { SystemAdminData };
const requestSettings = (homePageRepo) => async (stateChange) => {
    const thumbnail = await homePageRepo.getDocumentThumbnail();
    stateChange
        .next(updateThumbnail(thumbnail))
        .dispatch();
};
const updateThumbnail = (thumbnail) => (state) => {
    state.homePageThumbnail = thumbnail;
};
