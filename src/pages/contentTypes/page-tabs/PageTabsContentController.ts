import { hostEvent, Product, windowEvent } from "@domx/statecontroller";
import { ItemIndexChanged } from "../../../common/DragOrderController";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { AddPageRepoKey, EditPageRepoKey, IAddPageRepo, IEditPageRepo, IPageData, IPageTemplateDescriptor } from "../../../domain/interfaces/PageInterfaces";
import { FindPageRepo } from "../../../domain/Pages/FindPageRepo";
import { PageModel } from "../../../domain/Pages/PageModel";
import { pageTemplates } from "../../../domain/Pages/pageTemplates";
import { IPageState, PageLoadedEvent, UpdatePageContentEvent } from "../../hb-page";
import { PathnameChangedEvent } from "../../hb-page/hb-page-renderer/PageRendererController";
import { PageContentController } from "../../hb-page/PageContentController";
import { PageTabsContentData, PageTabsTab } from "./pageTabsContentType";


interface IPageTabsState extends PageTabsContentData {
    selectedTabIndex:number,
    selectedTabUrl:string,
    isOnRootPage:boolean,
    selectedTab:PageTabsTab|null,
    pageTemplates:Array<IPageTemplateDescriptor>,
    selectedPageTemplateKey:string,
    addPageError:string,
    isDirty:boolean
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

export class SelectPageTemplateEvent extends Event {
    static eventType = "select-page-template";
    templateKey:string;
    constructor(templateKey:string) {
        super(SelectPageTemplateEvent.eventType);
        this.templateKey = templateKey;
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

export class SaveTabsEvent extends Event {
    static eventType = "save-tabs";
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
export class PageTabsContentController extends PageContentController<IPageTabsState> {

    state:IPageTabsState = {
        ...this.defaultContent,
        ...this.content
    };

    get defaultContent():IPageTabsState {
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
    };

    stateUpdated() {
        this.page.state;
        this.state = { ...this.state, ...this.content };
        this.setInitialValues();  
    }

    @inject(AddPageRepoKey)
    private addPageRepo!:IAddPageRepo;

    @inject(EditPageRepoKey)
    private editPageRepo!:IEditPageRepo;

    async hostConnected() {
        super.hostConnected();
        await this.waitForTabs();
    }

    private async waitForTabs():Promise<void> {
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

    private setInitialValues() {
        Product.of<IPageTabsState>(this)
            .next(setIsOnRootPage(this.page.state))
            .tap(navigateToRootPage(this.page.state))
            .next(setRootPageIfNone(this.page.state.page))
            .next(setInitialSelectedPageTemplate)
            .next(setSelectedTabIfNone)
            .requestUpdate("PageTabsContentController.setRootPageIfNone");
    }
    
    @hostEvent(SelectedTabNameChanged)
    private selectedTabNameChanged(event:SelectedTabNameChanged) {
        Product.of<IPageTabsState>(this)
            .next(updateSelectedTabName(event.tabName))
            .next(setSelectedTabUrl)
            .next(setAddPageError(""))
            .next(setIsDirty(true))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, convertToPageTabsData(this.state)));
    }

    @hostEvent(DeleteSelectedTabEvent)
    private deleteSelectedTab(event:DeleteSelectedTabEvent) {
        Product.of<IPageTabsState>(this)
            .next(deleteSelectedTab)
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .tap(syncComponentsAndSave(this.page.state.page, this.editPageRepo));
    }

    @hostEvent(AddNewTabEvent)
    private addNewTab(event:AddNewTabEvent) {
        Product.of<IPageTabsState>(this)
            .next(addNewTab)
            .next(setSelectedTabUrl)
            .requestUpdate(event)
            .tap(syncComponentsAndSave(this.page.state.page, this.editPageRepo));
    }

    @hostEvent(SelectPageTemplateEvent)
    private selectPageTemplate(event:SelectPageTemplateEvent) {
        Product.of<IPageTabsState>(this)
            .next(selectPageTemplate(event.templateKey))
            .requestUpdate(event)
    }

    @hostEvent(AddNewPageEvent)
    private addNewPage(event:AddNewPageEvent) {
        Product.of<IPageTabsState>(this)
            .tap(addNewPage(this.page.state.page, this.addPageRepo, this.editPageRepo));
    }

    @hostEvent(DeleteSelectedPageEvent)
    private deleteSelectedPage(event:DeleteSelectedPageEvent) {
        alert("Delete not implemented");
    }

    @hostEvent(SaveTabsEvent)
    private saveTabs(event:SaveTabsEvent) {
        Product.of<IPageTabsState>(this)
            .tap(syncComponentsAndSave(this.page.state.page, this.editPageRepo));
    }

    @hostEvent(ItemIndexChanged)
    private itemIndexChanged(event:ItemIndexChanged) {
        console.log("item index changed", event.sourceIndex, event.targetIndex);
        Product.of<IPageTabsState>(this)
            .next(reorderItems(event.sourceIndex, event.targetIndex))
            .requestUpdate(event)
            .tap(syncComponentsAndSave(this.page.state.page, this.editPageRepo));
    }

    @hostEvent(SelectTabEvent)
    private selectTab(event:SelectTabEvent) {
        this.host.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        Product.of<IPageTabsState>(this)
            .next(setSelectedTabIndex(event.index))
            .next(setSelectedTabUrl)
            .requestUpdate(event);
    }

    @windowEvent(PageLoadedEvent)
    pageLoaded(event:PageLoadedEvent) {
        // prevent default to keep the page from scrolling
        event.preventDefault();
        window.scrollTo({
            top: 280,
            left: 0,
            behavior: "smooth"
        });
    }
}

const setSelectedTabIndex = (index:number) => (state:IPageTabsState) => {
    state.selectedTabIndex = index;
    state.selectedTab = state.tabs[index];
};


const setSelectedTabUrl = (state:IPageTabsState) => {
    if (!state.selectedTab) {
        return;
    }

    const url = `${state.rootPageUrl}/${PageModel.tokenize(state.selectedTab?.tabName)}`;
    state.selectedTabUrl = url;
};



const setInitialSelectedPageTemplate = (state:IPageTabsState) => {
    if (!state.selectedPageTemplateKey) {
        state.selectedPageTemplateKey = state.pageTemplates[0].key;
    }
};


const setIsOnRootPage = (pageState:IPageState) => (state:IPageTabsState) => {
    state.isOnRootPage = state.rootPageUrl === pageState.page.pathname;
    if (state.isOnRootPage) {
        state.selectedTabIndex = 0;
    }
}

const navigateToRootPage = (pageState:IPageState) => (product:Product<IPageTabsState>) => {
    const state = product.getState();
    const firstTab = state.tabs[0];
    if (state.isOnRootPage && pageState.inEditMode === false && firstTab && firstTab.url) {
        product.dispatchHostEvent(new PathnameChangedEvent(firstTab.url))
    }
};

const setRootPageIfNone = (page:IPageData) => (state:IPageTabsState) => {
    if (state.rootPageUrl) {
        return;
    }

    state.rootPageUrl = page.pathname;
    state.rootPageSubtitle = page.subtitle;
    state.rootPageTitle = page.title;
    state.rootPageUID = page.uid;
    state.isOnRootPage = true;
};



const updateSelectedTabName = (tabName:string) => (state:IPageTabsState) => {
    state.tabs[state.selectedTabIndex].tabName = tabName;
    state.selectedTab = state.tabs[state.selectedTabIndex];
};


const addNewTab = (state:IPageTabsState) => {
    state.tabs.push({
        pageUid: "",
        tabName: "New Tab",
        url: ""
    });
    state.selectedTabIndex = state.tabs.length -1;
    state.selectedTab = state.tabs[state.selectedTabIndex];
};

const deleteSelectedTab = (state:IPageTabsState) => {
    state.tabs.splice(state.selectedTabIndex, 1);
    state.selectedTabIndex = -1;
    state.selectedTab = null;
};

const selectPageTemplate = (templateKey:string) => (state:IPageTabsState) => {
    state.selectedPageTemplateKey = templateKey;
}


const setAddPageError = (error:string) => (state:IPageTabsState) => {
    state.addPageError = error;
};


const addNewPage = (currentPage:PageModel, addPageRepo:IAddPageRepo, editPageRepo:IEditPageRepo) => async (product:Product<IPageTabsState>) => {

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
        subtitle: state.rootPageSubtitle ?  state.rootPageSubtitle : undefined
    });

    product
        .next(setSelectedTabPageUid(newPage.uid))
        .requestUpdate("PageTabsContentController.addNewPage")
        .tap(syncComponentsAndSave(currentPage, editPageRepo));
};


const setSelectedTabPageUid = (uid:string) => (state:IPageTabsState) => {
    state.tabs[state.selectedTabIndex].pageUid = uid;
    state.selectedTab = state.tabs[state.selectedTabIndex];
};



const syncComponentsAndSave = (currentPage:PageModel, editPageRepo:IEditPageRepo) => async (product:Product<IPageTabsState>) => {
    const findPageRepo = new FindPageRepo();
    const state = product.getState();
    const pageTabsData = convertToPageTabsData(state);
    
    // load the tab pages
    const tabPages = state.tabs.map(tab => 
        (tab.pageUid === currentPage.uid || !tab.pageUid) ?
            Promise.resolve(null) : findPageRepo.findPage(tab.pageUid));

    // load the root page
    if (currentPage.uid !== pageTabsData.rootPageUID) {
        tabPages.push(findPageRepo.findPage(pageTabsData.rootPageUID));
    }

    // add the current page to save then save all pages
    const pagesToSave = await Promise.all(tabPages);
    pagesToSave.push(currentPage);
    const updatedPagesToSave = syncPagesAndTabsData(pageTabsData, pagesToSave.filter(page => page !== null) as Array<PageModel>);

    const savePages = pagesToSave.map(page =>
        page === null ? Promise.resolve() : saveTabsOnPage(editPageRepo, page, pageTabsData));

    await Promise.all(savePages);
    product.next(setIsDirty(false)).requestUpdate("PageTabsContentController.syncComponentsAndSave");
};


const syncPagesAndTabsData = (data:PageTabsContentData, pagesToSync:Array<PageModel>) => {
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


const saveTabsOnPage = async (editPageRepo: IEditPageRepo, page:PageModel, tabsData: PageTabsContentData) => {
    const contentIndex = page.content.findIndex(content => content.contentType === "page-tabs");
    if (contentIndex === -1) {
        page.content.unshift(tabsData);
    } else {
        page.content[contentIndex] = tabsData;
    }
    await editPageRepo.savePage(page);
};


const convertToPageTabsData = (pageTabsState:IPageTabsState):PageTabsContentData => {
    const state:PageTabsContentData = {
        contentType: pageTabsState.contentType,
        labelPlaceholder: pageTabsState.labelPlaceholder,
        label: pageTabsState.label,
        rootPageSubtitle: pageTabsState.rootPageSubtitle,
        rootPageTitle: pageTabsState.rootPageTitle,
        rootPageUID: pageTabsState.rootPageUID,
        rootPageUrl: pageTabsState.rootPageUrl,
        tabs: pageTabsState.tabs
    };
    return state;
};


const setIsDirty = (isDirty:boolean) => (state:IPageTabsState) => {
    state.isDirty = isDirty;
};


const setSelectedTabIfNone = (state:IPageTabsState) => {
    if (state.selectedTabIndex !== -1) {
        return;
    }

    const index = state.tabs.findIndex(tab => tab.url === location.pathname);
    state.selectedTabIndex = index;
};


const reorderItems = (sourceIndex:number, targetIndex:number) => (state:IPageTabsState) => {
    const tabs = state.tabs;
    const tab = tabs[sourceIndex];
    targetIndex = targetIndex >= tabs.length ? targetIndex - 1 : targetIndex;   
    tabs.splice(sourceIndex, 1);
    tabs.splice(targetIndex, 0, tab);
};