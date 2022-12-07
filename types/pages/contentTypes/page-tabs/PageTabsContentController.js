var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product } from "@domx/statecontroller";
import { HbCurrentUser } from "../../../domain/HbCurrentUser";
import { PageModel } from "../../../domain/Pages/PageModel";
import { PageContentController } from "../../hb-page/PageContentController";
export class SelectTabEvent extends Event {
    constructor(tabName) {
        super(SelectTabEvent.eventType);
        this.tabName = tabName;
    }
}
SelectTabEvent.eventType = "select-tab";
export class PageTabsContentController extends PageContentController {
    constructor() {
        super(...arguments);
        this.state = {
            ...this.content,
            selectedTabName: "",
            selectedTabUrl: "",
            selectedTab: null,
            rootPageUrl: location.pathname
        };
        this.currentUser = new HbCurrentUser();
    }
    stateUpdated() {
        debugger;
        this.state = { ...this.state, ...this.content };
    }
    async hostConnected() {
        super.hostConnected();
        await this.waitForTabs();
        this.requestUpdate("PageTabsContentController.hostConnected");
    }
    async waitForTabs() {
        return new Promise((resolve) => {
            if (!this.state.tabs || this.state.tabs.length === 0) {
                setTimeout(async () => {
                    this.stateUpdated();
                    await this.waitForTabs();
                    resolve();
                }, 0);
            }
            else {
                resolve();
            }
        });
    }
    getPageVisibility(isVisible) {
        return isVisible ? "visible" :
            this.page.state.page.authorUid === this.currentUser.uid ?
                "author" : "hidden";
    }
    selectTab(event) {
        Product.of(this)
            .next(setSelectedTab(event.tabName))
            .next(setSelectedTabUrl)
            .requestUpdate(event);
    }
}
__decorate([
    hostEvent(SelectTabEvent)
], PageTabsContentController.prototype, "selectTab", null);
const setSelectedTab = (tabName) => (state) => {
    state.selectedTabName = tabName;
    const tab = state.tabs.find(tab => tab.tabName === tabName) || null;
    state.selectedTab = tab;
};
const setSelectedTabUrl = (state) => {
    const url = `${state.rootPageUrl}/${PageModel.tokenize(state.selectedTabName)}`;
    state.selectedTabUrl = url;
};
