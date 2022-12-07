import { hostEvent, Product } from "@domx/statecontroller";
import { HbCurrentUser } from "../../../domain/HbCurrentUser";
import { IPageData } from "../../../domain/interfaces/PageInterfaces";
import { PageModel } from "../../../domain/Pages/PageModel";
import { IPageState, UpdatePageContentEvent } from "../../hb-page";
import { PageContentController } from "../../hb-page/PageContentController";
import { PageTabsContentData, PageTabsTab } from "./pageTabsContentType";


interface PageTabsState extends PageTabsContentData {
    selectedTabIndex:number,
    selectedTabUrl:string,
    selectedTab:PageTabsTab|null
}


export class SelectTabEvent extends Event {
    static eventType = "select-tab";
    index:number;
    constructor(index:number) {
        super(SelectTabEvent.eventType);
        this.index = index;
    }
}

export class SelectedTabNameChanged extends Event {
    static eventType = "selected-tab-name-changed";
    tabName:string;
    constructor(tabName:string) {
        super(SelectedTabNameChanged.eventType);
        this.tabName = tabName;
    }
}

export class AddNewPageEvent extends Event {
    static eventType = "add-new-page";
    constructor() {
        super(AddNewPageEvent.eventType);
    }
}

export class DeleteSelectedPageEvent extends Event {
    static eventType = "delete-selected-page";
    constructor() {
        super(DeleteSelectedPageEvent.eventType);
    }
}

export class DeleteSelectedTabEvent extends Event {
    static eventType = "delete-selected-tab";
    constructor() {
        super(DeleteSelectedTabEvent.eventType);
    }
}

export class AddNewTabEvent extends Event {
    static eventType = "add-new-tab";
    constructor() {
        super(AddNewTabEvent.eventType);
    }
}


export class PageTabsContentController extends PageContentController<PageTabsState> {

    state:PageTabsState = {
        ...this.content,
        selectedTabIndex: -1,
        selectedTabUrl: "",
        selectedTab: null
    };

    stateUpdated() {
        this.page.state;
        this.state = { ...this.state, ...this.content };
        this.setRootPageIfNone();  
    }

    private currentUser:HbCurrentUser = new HbCurrentUser();

    async hostConnected() {
        super.hostConnected();
        await this.waitForTabs();
    }

    async waitForTabs():Promise<void> {
        return new Promise((resolve) => {
            if (!this.state.tabs || this.state.tabs.length === 0) {            
                setTimeout(async () => {
                    this.stateUpdated();
                    await this.waitForTabs();
                    resolve();
                }, 0);
            } else {
                resolve();
            }
        });
    }

    newUpdatePageContentEvent() {
        const state:PageTabsContentData = {
            contentType:this.state.contentType,
            rootPageSubtitle: this.state.rootPageSubtitle,
            rootPageTitle: this.state.rootPageTitle,
            rootPageUID: this.state.rootPageUID,
            rootPageUrl: this.state.rootPageUrl,
            tabs: this.state.tabs
        }
        return new UpdatePageContentEvent(this.host.contentIndex, state);
    }

    getPageVisibility(isVisible:boolean):string {
        return isVisible ? "visible" :
            this.page.state.page.authorUid === this.currentUser.uid ?
            "author" : "hidden";
    }

    setRootPageIfNone() {
        Product.of<PageTabsState>(this)
            .next(setRootPageIfNone(this.page.state.page))
            .requestUpdate("PageTabsContentController.setRootPageIfNone");
    }

    @hostEvent(SelectTabEvent)
    selectTab(event:SelectTabEvent) {
        Product.of<PageTabsState>(this)
            .next(setSelectedTabIndex(event.index))
            .next(setSelectedTabUrl)
            .requestUpdate(event);
    }
    
    @hostEvent(SelectedTabNameChanged)
    selectedTabNameChanged(event:SelectedTabNameChanged) {
        Product.of<PageTabsState>(this)
            .next(updateSelectedTabName(event.tabName))
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .dispatchHostEvent(this.newUpdatePageContentEvent());
    }

    @hostEvent(DeleteSelectedTabEvent)
    deleteSelectedTab(event:DeleteSelectedTabEvent) {
        Product.of<PageTabsState>(this)
            .next(deleteSelectedTab)
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .dispatchHostEvent(this.newUpdatePageContentEvent());
    }

    @hostEvent(AddNewTabEvent)
    addNewTab(event:AddNewTabEvent) {
        Product.of<PageTabsState>(this)
            .next(addNewTab)
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .dispatchHostEvent(this.newUpdatePageContentEvent());
    }

    @hostEvent(AddNewPageEvent)
    addNewPage(event:AddNewPageEvent) {

    }

    @hostEvent(DeleteSelectedPageEvent)
    deleteSelectedPage(event:DeleteSelectedPageEvent) {

    }
}

const setSelectedTabIndex = (index:number) => (state:PageTabsState) => {
    state.selectedTabIndex = index;
    state.selectedTab = state.tabs[index];
};


const setSelectedTabUrl = (state:PageTabsState) => {
    if (!state.selectedTab) {
        return;
    }

    const url = `${state.rootPageUrl}/${PageModel.tokenize(state.selectedTab?.tabName)}`;
    state.selectedTabUrl = url;
};


const setRootPageIfNone = (page:IPageData) => (state:PageTabsState) => {
    if (state.rootPageUrl) {
        return;
    }

    state.rootPageUrl = page.pathname;
    state.rootPageSubtitle = page.subtitle;
    state.rootPageTitle = page.title;
    state.rootPageUID = page.uid;
};



const updateSelectedTabName = (tabName:string) => (state:PageTabsState) => {
    state.tabs[state.selectedTabIndex].tabName = tabName;
    state.selectedTab = state.tabs[state.selectedTabIndex];
};


const addNewTab = (state:PageTabsState) => {
    state.tabs.push({
        pageUid: "",
        tabName: "New Tab",
        url: ""
    });
    state.selectedTabIndex = state.tabs.length -1;
    state.selectedTab = state.tabs[state.selectedTabIndex];
};

const deleteSelectedTab = (state:PageTabsState) => {
    state.tabs.splice(state.selectedTabIndex, 1);
    state.selectedTabIndex = -1;
    state.selectedTab = null;
};