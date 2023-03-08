var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product, windowEvent } from "@domx/statecontroller";
import { ItemIndexChanged } from "../../../common/DragOrderController";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { AddPageRepoKey, EditPageRepoKey } from "../../../domain/interfaces/PageInterfaces";
import { FindPageRepo } from "../../../domain/Pages/FindPageRepo";
import { PageModel } from "../../../domain/Pages/PageModel";
import { pageTemplates } from "../../../domain/Pages/pageTemplates";
import { PageLoadedEvent, UpdatePageContentEvent } from "../../hb-page";
import { PathnameChangedEvent } from "../../hb-page/hb-page-renderer/PageRendererController";
import { PageContentController } from "../../hb-page/PageContentController";
import { PageTabsContentData } from "./pageTabsContentType";
export class SelectTabEvent extends Event {
    static { this.eventType = "select-tab"; }
    constructor(index) {
        super(SelectTabEvent.eventType);
        this.index = index;
    }
}
export class SelectedTabNameChanged extends Event {
    static { this.eventType = "selected-tab-name-changed"; }
    constructor(tabName) {
        super(SelectedTabNameChanged.eventType);
        this.tabName = tabName;
    }
}
export class SelectPageTemplateEvent extends Event {
    static { this.eventType = "select-page-template"; }
    constructor(templateKey) {
        super(SelectPageTemplateEvent.eventType);
        this.templateKey = templateKey;
    }
}
export class AddNewPageEvent extends Event {
    static { this.eventType = "add-new-page"; }
    constructor() {
        super(AddNewPageEvent.eventType);
    }
}
export class DeleteSelectedPageEvent extends Event {
    static { this.eventType = "delete-selected-page"; }
    constructor() {
        super(DeleteSelectedPageEvent.eventType);
    }
}
export class DeleteSelectedTabEvent extends Event {
    static { this.eventType = "delete-selected-tab"; }
    constructor() {
        super(DeleteSelectedTabEvent.eventType);
    }
}
export class AddNewTabEvent extends Event {
    static { this.eventType = "add-new-tab"; }
    constructor() {
        super(AddNewTabEvent.eventType);
    }
}
export class SaveTabsEvent extends Event {
    static { this.eventType = "save-tabs"; }
    constructor() {
        super(SaveTabsEvent.eventType);
    }
}
/**
 * Note: There are two ways to save
 *
 * 1. Dispatching the traditional `{@link UpdatePageContentEvent}` which will save the current page and
 * mark the state as dirty since the other pages are not synced/saved yet.
 *
 * 2. Tapping into the `{@link syncComponentsAndSave}` method to save and sync. This is also done
 * by dispatching the `{@link SaveTabsEvent}` from the UI component.
 */
export class PageTabsContentController extends PageContentController {
    constructor() {
        super(...arguments);
        this.state = {
            ...this.defaultContent,
            ...this.content
        };
    }
    get defaultContent() {
        return {
            ...new PageTabsContentData(),
            selectedPageTemplateKey: "",
            selectedTabIndex: -1,
            selectedTabUrl: "",
            selectedTab: null,
            isOnRootPage: false,
            pageTemplates: pageTemplates.all().filter(t => t.key !== "tabbed-page"),
            addPageError: "",
            isDirty: false
        };
    }
    ;
    stateUpdated() {
        this.page.state;
        this.state = { ...this.state, ...this.content };
        this.setInitialValues();
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
    setInitialValues() {
        Product.of(this)
            .next(setIsOnRootPage(this.page.state))
            .tap(navigateToRootPage(this.page.state))
            .next(setRootPageIfNone(this.page.state.page))
            .next(setInitialSelectedPageTemplate)
            .next(setSelectedTabIfNone)
            .requestUpdate("PageTabsContentController.setRootPageIfNone");
    }
    selectedTabNameChanged(event) {
        Product.of(this)
            .next(updateSelectedTabName(event.tabName))
            .next(setSelectedTabUrl)
            .next(setAddPageError(""))
            .next(setIsDirty(true))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, convertToPageTabsData(this.state)));
    }
    deleteSelectedTab(event) {
        Product.of(this)
            .next(deleteSelectedTab)
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .tap(syncComponentsAndSave(this.page.state.page, this.editPageRepo));
    }
    addNewTab(event) {
        Product.of(this)
            .next(addNewTab)
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .tap(syncComponentsAndSave(this.page.state.page, this.editPageRepo));
    }
    selectPageTemplate(event) {
        Product.of(this)
            .next(selectPageTemplate(event.templateKey))
            .requestUpdate(event);
    }
    addNewPage(event) {
        Product.of(this)
            .tap(addNewPage(this.page.state.page, this.addPageRepo, this.editPageRepo));
    }
    deleteSelectedPage(event) {
        alert("Delete not implemented");
    }
    saveTabs(event) {
        Product.of(this)
            .tap(syncComponentsAndSave(this.page.state.page, this.editPageRepo));
    }
    itemIndexChanged(event) {
        console.log("item index changed", event.sourceIndex, event.targetIndex);
        Product.of(this)
            .next(reorderItems(event.sourceIndex, event.targetIndex))
            .requestUpdate(event)
            .tap(syncComponentsAndSave(this.page.state.page, this.editPageRepo));
    }
    selectTab(event) {
        this.host.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
        Product.of(this)
            .next(setSelectedTabIndex(event.index))
            .next(setSelectedTabUrl)
            .requestUpdate(event);
    }
    pageLoaded(event) {
        // prevent default to keep the page from scrolling
        event.preventDefault();
        window.scrollTo({
            top: 280,
            left: 0,
            behavior: "smooth"
        });
    }
}
__decorate([
    inject(AddPageRepoKey)
], PageTabsContentController.prototype, "addPageRepo", void 0);
__decorate([
    inject(EditPageRepoKey)
], PageTabsContentController.prototype, "editPageRepo", void 0);
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
    hostEvent(SelectPageTemplateEvent)
], PageTabsContentController.prototype, "selectPageTemplate", null);
__decorate([
    hostEvent(AddNewPageEvent)
], PageTabsContentController.prototype, "addNewPage", null);
__decorate([
    hostEvent(DeleteSelectedPageEvent)
], PageTabsContentController.prototype, "deleteSelectedPage", null);
__decorate([
    hostEvent(SaveTabsEvent)
], PageTabsContentController.prototype, "saveTabs", null);
__decorate([
    hostEvent(ItemIndexChanged)
], PageTabsContentController.prototype, "itemIndexChanged", null);
__decorate([
    hostEvent(SelectTabEvent)
], PageTabsContentController.prototype, "selectTab", null);
__decorate([
    windowEvent(PageLoadedEvent, { capture: false })
], PageTabsContentController.prototype, "pageLoaded", null);
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
const setInitialSelectedPageTemplate = (state) => {
    if (!state.selectedPageTemplateKey) {
        state.selectedPageTemplateKey = state.pageTemplates[0].key;
    }
};
const setIsOnRootPage = (pageState) => (state) => {
    state.isOnRootPage = state.rootPageUrl === pageState.page.pathname;
    if (state.isOnRootPage) {
        state.selectedTabIndex = 0;
    }
};
const navigateToRootPage = (pageState) => (product) => {
    const state = product.getState();
    const firstTab = state.tabs[0];
    if (state.isOnRootPage && pageState.inEditMode === false && firstTab && firstTab.url) {
        product.dispatchHostEvent(new PathnameChangedEvent(firstTab.url));
    }
};
const setRootPageIfNone = (page) => (state) => {
    if (state.rootPageUrl) {
        return;
    }
    state.rootPageUrl = page.pathname;
    state.rootPageSubtitle = page.subtitle;
    state.rootPageTitle = page.title;
    state.rootPageUID = page.uid;
    state.isOnRootPage = true;
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
const selectPageTemplate = (templateKey) => (state) => {
    state.selectedPageTemplateKey = templateKey;
};
const setAddPageError = (error) => (state) => {
    state.addPageError = error;
};
const addNewPage = (currentPage, addPageRepo, editPageRepo) => async (product) => {
    const state = product.getState();
    if (!state.selectedTab) {
        return;
    }
    const pageExists = await addPageRepo.pageExists(state.selectedTab.url);
    if (pageExists) {
        product
            .next(setAddPageError("The page already exists"))
            .requestUpdate("PageTabsContentController.addNewPage");
        return;
    }
    const newPage = await addPageRepo.addPage({
        pageTemplate: state.selectedPageTemplateKey,
        pathname: state.selectedTabUrl,
        title: state.rootPageTitle,
        subtitle: state.rootPageSubtitle ? state.rootPageSubtitle : undefined
    });
    product
        .next(setSelectedTabPageUid(newPage.uid))
        .requestUpdate("PageTabsContentController.addNewPage")
        .tap(syncComponentsAndSave(currentPage, editPageRepo));
};
const setSelectedTabPageUid = (uid) => (state) => {
    state.tabs[state.selectedTabIndex].pageUid = uid;
    state.selectedTab = state.tabs[state.selectedTabIndex];
};
const syncComponentsAndSave = (currentPage, editPageRepo) => async (product) => {
    const findPageRepo = new FindPageRepo();
    const state = product.getState();
    const pageTabsData = convertToPageTabsData(state);
    // load the tab pages
    const tabPages = state.tabs.map(tab => (tab.pageUid === currentPage.uid || !tab.pageUid) ?
        Promise.resolve(null) : findPageRepo.findPage(tab.pageUid));
    // load the root page
    if (currentPage.uid !== pageTabsData.rootPageUID) {
        tabPages.push(findPageRepo.findPage(pageTabsData.rootPageUID));
    }
    // add the current page to save then save all pages
    const pagesToSave = await Promise.all(tabPages);
    pagesToSave.push(currentPage);
    const updatedPagesToSave = syncPagesAndTabsData(pageTabsData, pagesToSave.filter(page => page !== null));
    const savePages = pagesToSave.map(page => page === null ? Promise.resolve() : saveTabsOnPage(editPageRepo, page, pageTabsData));
    await Promise.all(savePages);
    product.next(setIsDirty(false)).requestUpdate("PageTabsContentController.syncComponentsAndSave");
};
const syncPagesAndTabsData = (data, pagesToSync) => {
    const pages = [...pagesToSync];
    const rootPage = pages.find(page => page.uid === data.rootPageUID);
    if (rootPage) {
        data.rootPageTitle = rootPage.title;
        data.rootPageUID = rootPage.uid;
        data.rootPageSubtitle = rootPage.subtitle;
        data.rootPageUrl = rootPage.pathname;
    }
    data.tabs = data.tabs.map(tab => {
        const tabPage = pages.find(page => page.uid === tab.pageUid);
        if (tabPage) {
            tabPage.title = `${data.rootPageTitle} / ${tab.tabName}`;
            tabPage.displayTitle = data.rootPageTitle;
            tabPage.subtitle = data.rootPageSubtitle;
            return {
                ...tab,
                url: tabPage.pathname
            };
        }
        return tab;
    });
    return pages;
};
const saveTabsOnPage = async (editPageRepo, page, tabsData) => {
    const contentIndex = page.content.findIndex(content => content.contentType === "page-tabs");
    if (contentIndex === -1) {
        page.content.unshift(tabsData);
    }
    else {
        page.content[contentIndex] = tabsData;
    }
    await editPageRepo.savePage(page);
};
const convertToPageTabsData = (pageTabsState) => {
    const state = {
        uid: pageTabsState.uid,
        contentType: pageTabsState.contentType,
        label: pageTabsState.label,
        rootPageSubtitle: pageTabsState.rootPageSubtitle,
        rootPageTitle: pageTabsState.rootPageTitle,
        rootPageUID: pageTabsState.rootPageUID,
        rootPageUrl: pageTabsState.rootPageUrl,
        tabs: pageTabsState.tabs
    };
    return state;
};
const setIsDirty = (isDirty) => (state) => {
    state.isDirty = isDirty;
};
const setSelectedTabIfNone = (state) => {
    if (state.selectedTabIndex !== -1) {
        return;
    }
    const index = state.tabs.findIndex(tab => tab.url === location.pathname);
    state.selectedTabIndex = index;
};
const reorderItems = (sourceIndex, targetIndex) => (state) => {
    const tabs = state.tabs;
    const tab = tabs[sourceIndex];
    targetIndex = targetIndex >= tabs.length ? targetIndex - 1 : targetIndex;
    tabs.splice(sourceIndex, 1);
    tabs.splice(targetIndex, 0, tab);
};
