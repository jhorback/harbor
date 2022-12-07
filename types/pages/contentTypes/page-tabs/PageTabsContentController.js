var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product } from "@domx/statecontroller";
import { HbCurrentUser } from "../../../domain/HbCurrentUser";
import { PageModel } from "../../../domain/Pages/PageModel";
import { UpdatePageContentEvent } from "../../hb-page";
import { PageContentController } from "../../hb-page/PageContentController";
export class SelectTabEvent extends Event {
    constructor(index) {
        super(SelectTabEvent.eventType);
        this.index = index;
    }
}
SelectTabEvent.eventType = "select-tab";
export class SelectedTabNameChanged extends Event {
    constructor(tabName) {
        super(SelectedTabNameChanged.eventType);
        this.tabName = tabName;
    }
}
SelectedTabNameChanged.eventType = "selected-tab-name-changed";
export class AddNewPageEvent extends Event {
    constructor() {
        super(AddNewPageEvent.eventType);
    }
}
AddNewPageEvent.eventType = "add-new-page";
export class DeleteSelectedPageEvent extends Event {
    constructor() {
        super(DeleteSelectedPageEvent.eventType);
    }
}
DeleteSelectedPageEvent.eventType = "delete-selected-page";
export class DeleteSelectedTabEvent extends Event {
    constructor() {
        super(DeleteSelectedTabEvent.eventType);
    }
}
DeleteSelectedTabEvent.eventType = "delete-selected-tab";
export class AddNewTabEvent extends Event {
    constructor() {
        super(AddNewTabEvent.eventType);
    }
}
AddNewTabEvent.eventType = "add-new-tab";
export class PageTabsContentController extends PageContentController {
    constructor() {
        super(...arguments);
        this.state = {
            ...this.content,
            selectedTabIndex: -1,
            selectedTabUrl: "",
            selectedTab: null
        };
        this.currentUser = new HbCurrentUser();
    }
    stateUpdated() {
        this.page.state;
        this.state = { ...this.state, ...this.content };
        this.setRootPageIfNone();
    }
    async hostConnected() {
        super.hostConnected();
        await this.waitForTabs();
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
    newUpdatePageContentEvent() {
        const state = {
            contentType: this.state.contentType,
            rootPageSubtitle: this.state.rootPageSubtitle,
            rootPageTitle: this.state.rootPageTitle,
            rootPageUID: this.state.rootPageUID,
            rootPageUrl: this.state.rootPageUrl,
            tabs: this.state.tabs
        };
        return new UpdatePageContentEvent(this.host.contentIndex, state);
    }
    getPageVisibility(isVisible) {
        return isVisible ? "visible" :
            this.page.state.page.authorUid === this.currentUser.uid ?
                "author" : "hidden";
    }
    setRootPageIfNone() {
        Product.of(this)
            .next(setRootPageIfNone(this.page.state.page))
            .requestUpdate("PageTabsContentController.setRootPageIfNone");
    }
    selectTab(event) {
        Product.of(this)
            .next(setSelectedTabIndex(event.index))
            .next(setSelectedTabUrl)
            .requestUpdate(event);
    }
    selectedTabNameChanged(event) {
        Product.of(this)
            .next(updateSelectedTabName(event.tabName))
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .dispatchHostEvent(this.newUpdatePageContentEvent());
    }
    deleteSelectedTab(event) {
        Product.of(this)
            .next(deleteSelectedTab)
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .dispatchHostEvent(this.newUpdatePageContentEvent());
    }
    addNewTab(event) {
        Product.of(this)
            .next(addNewTab)
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .dispatchHostEvent(this.newUpdatePageContentEvent());
    }
    addNewPage(event) {
    }
    deleteSelectedPage(event) {
    }
}
__decorate([
    hostEvent(SelectTabEvent)
], PageTabsContentController.prototype, "selectTab", null);
__decorate([
    hostEvent(SelectedTabNameChanged)
], PageTabsContentController.prototype, "selectedTabNameChanged", null);
__decorate([
    hostEvent(DeleteSelectedTabEvent)
], PageTabsContentController.prototype, "deleteSelectedTab", null);
__decorate([
    hostEvent(AddNewTabEvent)
], PageTabsContentController.prototype, "addNewTab", null);
__decorate([
    hostEvent(AddNewPageEvent)
], PageTabsContentController.prototype, "addNewPage", null);
__decorate([
    hostEvent(DeleteSelectedPageEvent)
], PageTabsContentController.prototype, "deleteSelectedPage", null);
const setSelectedTabIndex = (index) => (state) => {
    state.selectedTabIndex = index;
    state.selectedTab = state.tabs[index];
};
const setSelectedTabUrl = (state) => {
    if (!state.selectedTab) {
        return;
    }
    const url = `${state.rootPageUrl}/${PageModel.tokenize(state.selectedTab?.tabName)}`;
    state.selectedTabUrl = url;
};
const setRootPageIfNone = (page) => (state) => {
    if (state.rootPageUrl) {
        return;
    }
    state.rootPageUrl = page.pathname;
    state.rootPageSubtitle = page.subtitle;
    state.rootPageTitle = page.title;
    state.rootPageUID = page.uid;
};
const updateSelectedTabName = (tabName) => (state) => {
    state.tabs[state.selectedTabIndex].tabName = tabName;
    state.selectedTab = state.tabs[state.selectedTabIndex];
};
const addNewTab = (state) => {
    state.tabs.push({
        pageUid: "",
        tabName: "New Tab",
        url: ""
    });
    state.selectedTabIndex = state.tabs.length - 1;
    state.selectedTab = state.tabs[state.selectedTabIndex];
};
const deleteSelectedTab = (state) => {
    state.tabs.splice(state.selectedTabIndex, 1);
    state.selectedTabIndex = -1;
    state.selectedTab = null;
};
