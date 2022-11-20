import { Product } from "@domx/statecontroller";
import { hostEvent } from "@domx/statecontroller";
import "../../../domain/Files/HbFindFileRepo";
import { IPageThumbnail } from "../../../domain/interfaces/PageInterfaces";
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

export class PageListContentController extends PageContentController<PageListContentData> {

    state:PageListContentData = { ...this.content };

    stateUpdated() {
        this.state = { ...this.content };
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
}

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


// todo - sync with db method for syncing updates