import { hostEvent, Product } from "@domx/statecontroller";
import { HbCurrentUser } from "../../../domain/HbCurrentUser";
import { PageModel } from "../../../domain/Pages/PageModel";
import { PageContentController } from "../../hb-page/PageContentController";
import { PageTabsContentData, PageTabsTab } from "./pageTabsContentType";


interface PageTabsState extends PageTabsContentData {
    selectedTabName:string,
    selectedTabUrl:string,
    selectedTab:PageTabsTab|null
}


export class SelectTabEvent extends Event {
    static eventType = "select-tab";
    tabName:string;
    constructor(tabName:string) {
        super(SelectTabEvent.eventType);
        this.tabName = tabName;
    }
}


export class PageTabsContentController extends PageContentController<PageTabsState> {

    state:PageTabsState = {
        ...this.content,
        selectedTabName: "",
        selectedTabUrl: "",
        selectedTab: null,
        rootPageUrl: location.pathname
    };

    stateUpdated() {
        debugger;
        this.state = { ...this.state, ...this.content };        
    }

    private currentUser:HbCurrentUser = new HbCurrentUser();

    async hostConnected() {
        super.hostConnected();
        await this.waitForTabs();
        this.requestUpdate("PageTabsContentController.hostConnected");
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

    getPageVisibility(isVisible:boolean):string {
        return isVisible ? "visible" :
            this.page.state.page.authorUid === this.currentUser.uid ?
            "author" : "hidden";
    }

    @hostEvent(SelectTabEvent)
    selectTab(event:SelectTabEvent) {
        Product.of<PageTabsState>(this)
            .next(setSelectedTab(event.tabName))
            .next(setSelectedTabUrl)
            .requestUpdate(event);
    }
    
}

const setSelectedTab = (tabName:string) => (state:PageTabsState) => {
    state.selectedTabName = tabName;
    const tab = state.tabs.find(tab => tab.tabName === tabName) || null;
    state.selectedTab = tab;
};


const setSelectedTabUrl = (state:PageTabsState) => {
    const url = `${state.rootPageUrl}/${PageModel.tokenize(state.selectedTabName)}`;
    state.selectedTabUrl = url;
};