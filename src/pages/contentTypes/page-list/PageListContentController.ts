import { Product } from "@domx/statecontroller";
import { hostEvent } from "@domx/statecontroller";
import "../../../domain/Files/HbFindFileRepo";
import { HbCurrentUser } from "../../../domain/HbCurrentUser";
import { IPageThumbnail } from "../../../domain/interfaces/PageInterfaces";
import { FindPageRepo } from "../../../domain/Pages/FindPageRepo";
import { PageModel } from "../../../domain/Pages/PageModel";
import { PageThumbChangeEvent, UpdatePageContentEvent } from "../../hb-page";
import { PageContentController } from "../../hb-page/PageContentController";
import { PageListContentData, PageListDisplay } from "./pageListContentType";


export class AddListPageEvent extends Event {
    static eventType = "add-list-page";
    page:IPageThumbnail;
    constructor(page:IPageThumbnail) {
        super(AddListPageEvent.eventType);
        this.page = page;
    }
}

export class ChangePageListDisplayEvent extends Event {
    static eventType = "change-page-list-display";
    display:PageListDisplay;
    constructor(display:PageListDisplay) {
        super(ChangePageListDisplayEvent.eventType);
        this.display = display;
    }
}

export class ReorderPageListItemsEvent extends Event {
    static eventType = "reorder-page-list-items";
    sourceIndex:number;
    targetIndex:number;
    constructor(sourceIndex:number, targetIndex:number) {
        super(ReorderPageListItemsEvent.eventType, {bubbles:true, composed:true});
        this.sourceIndex = sourceIndex;
        this.targetIndex = targetIndex;
    }
}

export class RemovePageListItemEvent extends Event {
    static eventType = "remove-page-list-item";
    index:number;
    constructor(index:number) {
        super(RemovePageListItemEvent.eventType, {bubbles:true, composed: true});
        this.index = index;
    }
}

export class PageListContentController extends PageContentController<PageListContentData> {

    state:PageListContentData = { ...this.content };
    
    get defaultContent():PageListContentData {
        return new PageListContentData();
    }

    stateUpdated() {
        this.state = { ...this.content };
        if(!this.isSynced) {
            this.syncPages();
        }
    }

    private currentUser:HbCurrentUser = new HbCurrentUser();

    getPageVisibility(isVisible:boolean):string {
        return isVisible ? "visible" :
            this.page.state.page.authorUid === this.currentUser.uid ?
            "author" : "hidden";
    }

    private isSynced!:boolean;

    private syncPages() {
        this.isSynced = true;
        Product.of<PageListContentData>(this)
            .tap(syncPages(this, this.host.contentIndex));
    }

    @hostEvent(AddListPageEvent)
    addListPage(event:AddListPageEvent) {
        Product.of<PageListContentData>(this)
            .next(addPage(event.page))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state))
            .tap(sendThumb(event.page));
    }

    @hostEvent(ChangePageListDisplayEvent)
    changeDisplay(event:ChangePageListDisplayEvent) {
        Product.of<PageListContentData>(this)
            .next(setDisplay(event.display))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state));
    }

    @hostEvent(ReorderPageListItemsEvent)
    reorderItems(event:ReorderPageListItemsEvent) {
        Product.of<PageListContentData>(this)
            .next(reorderItems(event.sourceIndex, event.targetIndex))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state));
    }

    @hostEvent(RemovePageListItemEvent)
    removePageListItem(event:RemovePageListItemEvent) {
        Product.of<PageListContentData>(this)
            .next(removeItem(event.index))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state));
    }
}


const removeItem = (index:number) => (state:PageListContentData) => {
    state.pages.splice(index, 1);
};


const reorderItems = (sourceIndex:number, targetIndex:number) => (state:PageListContentData) => {
    const pages = state.pages;
    const page = pages[sourceIndex];
    targetIndex = targetIndex >= pages.length ? targetIndex - 1 : targetIndex;   
    pages.splice(sourceIndex, 1);
    pages.splice(targetIndex, 0, page);
};

const sendThumb = (page:IPageThumbnail) => (product:Product<PageListContentData>) => {
    if (page.thumbUrl) {
        product.dispatchHostEvent(new PageThumbChangeEvent({
            thumbs: [page.thumbUrl]
        }));
    }
};

const addPage = (page:IPageThumbnail) => (state:PageListContentData) => {
    state.pages.push(page);
};


const setDisplay = (display:PageListDisplay) => (state:PageListContentData) => {
    state.display = display;
};


const syncPages = (controller:PageListContentController, contentIndex:number) => async (product:Product<PageListContentData>) => {

    const state = product.getState();
    const findPageRepo = new FindPageRepo();
    const pageRequests = state.pages.map(page => findPageRepo.findPage(page.uid));
    const pagesOrNull = await Promise.all(pageRequests);
    const pages = pagesOrNull.filter(p => p !== null) as Array<PageModel>;
    product
        .next(setPages(pages))
        .requestUpdate("PageListContentController.syncPages")
        .dispatchHostEvent(new UpdatePageContentEvent(contentIndex, product.getState()))
};


const setPages = (pages:Array<PageModel>) => (state:PageListContentData) => {
    state.pages = pages.map(p => p.toPageThumbnail());
};