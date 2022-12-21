import { hostEvent, Product, StateController, stateProperty, windowEvent } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { HbCurrentUser, UserAction } from "../../domain/HbCurrentUser";
import { IContentType, IPageTemplateDescriptor, PageSize } from "../../domain/interfaces/PageInterfaces";
import { EditPageRepoKey, IEditPageRepo } from "../../domain/interfaces/PageInterfaces";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
import "../../domain/Pages/HbEditPageRepo";
import { HbCurrentUserChangedEvent } from "../../domain/HbAuth";
import { LitElement } from "lit";
import { NotFoundError } from "../../domain/Errors";
import { contentTypes } from "../../domain/Pages/contentTypes";



/**
 * Dispatched when the page is loaded from the database
 * Calling preventDefault will keep the window from scrolling
 */
export class PageLoadedEvent extends Event {
    static eventType = "page-loaded";
    constructor() {
        super(PageLoadedEvent.eventType, {bubbles: true, composed: true, cancelable: true});
    }
}

export class RequestPageEvent extends Event {
    static eventType = "request-page";
    constructor() {
        super(RequestPageEvent.eventType);
    }
}

export class PagePathnameChangeEvent extends Event {
    static eventType = "page-pathname-change";
    pathname:string;
    constructor(pathname:string) {
        super(PagePathnameChangeEvent.eventType);
        this.pathname = pathname;
    }
}

export class UpdateShowTitleEvent extends Event {
    static eventType = "update-show-title";
    showTitle:boolean;
    constructor(showTitle:boolean) {
        super(UpdateShowTitleEvent.eventType);
        this.showTitle = showTitle;
    }
}

export class UpdateShowSubtitleEvent extends Event {
    static eventType = "update-show-subtitle";
    showSubtitle:boolean;
    constructor(showSubtitle:boolean) {
        super(UpdateShowSubtitleEvent.eventType);
        this.showSubtitle = showSubtitle;
    }
}

export class UpdatePageVisibilityEvent extends Event {
    static eventType = "update-page-visibility";
    isVisible:boolean;
    constructor(isVisible:boolean) {
        super(UpdatePageVisibilityEvent.eventType);
        this.isVisible = isVisible;
    }
}

export class UpdateSubtitleEvent extends Event {
    static eventType = "update-subtitle";
    subtitle:string;
    constructor(subtitle:string) {
        super(UpdateSubtitleEvent.eventType);
        this.subtitle = subtitle;
    }
}

export class UpdatePageSizeEvent extends Event {
    static eventType = "update-page-size";
    size:PageSize;
    constructor(size:PageSize) {
        super(UpdatePageSizeEvent.eventType);
        this.size = size;
    }
}

export class UpdatePageContentEvent extends Event {
    static eventType = "update-page-content";
    index:number;
    state:IContentType;
    constructor(index:number, state:IContentType) {
        super(UpdatePageContentEvent.eventType, {bubbles:true, composed:true});
        if (!(index > -1)) {
            throw new Error("index must be 0 or greater");
        }
        this.index = index;
        this.state = state;
    }
}

export class MovePageContentEvent extends Event {
    static eventType = "move-page-content";
    index:number;
    moveUp:boolean;
    constructor(index:number, moveUp:boolean) {
        super(MovePageContentEvent.eventType, {bubbles:true, composed:true});
        this.index = index;
        this.moveUp = moveUp;
    }
}

interface IPageThumbChangeEventOptions {
    removeIndex?:number;
    setIndex?:number;
    thumbs?:Array<string>;
}

export class PageThumbChangeEvent extends Event {
    static eventType = "page-thumb-change";
    removeIndex?:number;
    setIndex?:number;
    thumbs?:Array<string>;
    constructor(options:IPageThumbChangeEventOptions) {
        super(PageThumbChangeEvent.eventType, {bubbles:true, composed:true});
        this.thumbs = options.thumbs;
        this.setIndex = options.setIndex;
        this.removeIndex = options.removeIndex;
    }
}

export class PageEditModeChangeEvent extends Event {
    static eventType = "page-edit-mode-change";
    inEditMode:boolean;
    constructor(inEditMode:boolean) {
        super(PageEditModeChangeEvent.eventType);
        this.inEditMode = inEditMode;
    }
}

export class EditTabClickedEvent extends Event {
    static eventType = "edit-tab-clicked";
    tab:string;
    constructor(tab:string) {
        super(EditTabClickedEvent.eventType);
        this.tab = tab;
    }
}

export interface ContentActiveChangeOptions {
    contentIndex: number;
    isActive: boolean;
    inEditMode: boolean;
}

export class ContentActiveChangeEvent extends Event {
    static eventType = "content-active-change";
    options:ContentActiveChangeOptions;
    constructor(options:ContentActiveChangeOptions) {
        super(ContentActiveChangeEvent.eventType, {bubbles: true, composed: true});
        this.options = options;
    }
}

export class ContentDeletedEvent extends Event {
    static eventType = "content-deleted";
    index:number;
    constructor(index:number) {
        super(ContentDeletedEvent.eventType, {bubbles: true, composed: true});
        this.index = index;
    }
}

export class AddContentEvent extends Event {
    static eventType = "add-content";
    contentType:string;
    constructor(contentType:string) {
        super(AddContentEvent.eventType);
        this.contentType = contentType;
    }
}


export interface IPageState {
    isLoaded: boolean;
    page:PageModel;
    currentUserCanEdit: boolean;
    currentUserCanAdd: boolean;
    selectedEditTab: string;
    inEditMode: boolean;
    activeContentIndex: number;
    editableContentIndex: number;
    pageTemplate:IPageTemplateDescriptor;
}

export interface IPageElement extends LitElement {
    pathname:string;
    stateId:string;
}

export class PageController extends StateController {
    static getDefaultState():IPageState {
        return {
            isLoaded: false,
            page: new PageModel(),
            currentUserCanEdit: true,
            currentUserCanAdd: true,
            selectedEditTab: "",
            inEditMode: false,
            activeContentIndex: -1,
            editableContentIndex: -1,
            pageTemplate: pageTemplates.get("page")
        };
    };

    @stateProperty()
    state:IPageState = PageController.getDefaultState();

    @inject<IEditPageRepo>(EditPageRepoKey)
    private editPageRepo!:IEditPageRepo;

    public host:IPageElement;

    constructor(host:IPageElement) {
        super(host);
        this.host = host;
    }

    @windowEvent(HbCurrentUserChangedEvent, {capture: false})
    private currentUserChanged(event:HbCurrentUserChangedEvent) {
        Product.of<IPageState>(this)
            .next(updateUserCanEdit)
            .next(updateUserCanAdd)
            .requestUpdate(event);
    }

    @windowEvent(PagePathnameChangeEvent, {capture: false})
    private async pagePathnameChangeEvent(event:PagePathnameChangeEvent) {
        await this.host.updateComplete;
        // this.state = PageController.getDefaultState();
        this.refreshState();
    }

    @hostEvent(RequestPageEvent)
    private requestPage(event: RequestPageEvent) {
        this.editPageRepo.subscribeToPage(this.host.pathname,
            subscribeToPage(this), this.abortController.signal);
    }

    @hostEvent(UpdateShowTitleEvent)
    private updateShowTitle(event:UpdateShowTitleEvent) {
        Product.of<IPageState>(this)
            .next(updateShowTitle(event.showTitle))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(UpdateShowSubtitleEvent)
    private updateShowSubtitle(event:UpdateShowSubtitleEvent) {
        Product.of<IPageState>(this)
            .next(updateShowSubtitle(event.showSubtitle))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(UpdateSubtitleEvent)
    private updateSubtitle(event:UpdateSubtitleEvent) {
        Product.of<IPageState>(this)
            .next(updateSubtitle(event.subtitle))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(UpdatePageSizeEvent)
    private updatePageSize(event:UpdatePageSizeEvent) {
        Product.of<IPageState>(this)
            .next(updatePageSize(event.size))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(UpdatePageVisibilityEvent)
    updatePageVisibility(event:UpdatePageVisibilityEvent) {
        Product.of<IPageState>(this)
            .next(updatePageVisibility(event.isVisible))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(UpdatePageContentEvent)
    private updatePageContent(event:UpdatePageContentEvent) {
        Product.of<IPageState>(this)
            .next(updatePageContent(event.index, event.state))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(MovePageContentEvent)
    private moveContent(event:MovePageContentEvent) {
        Product.of<IPageState>(this)
            .next(moveContent(event.index, event.moveUp))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(ContentActiveChangeEvent)
    private contentActiveChange(event:ContentActiveChangeEvent) {
        Product.of<IPageState>(this)
            .next(setContentActive(event.options))
            .requestUpdate(event);
    }

    @hostEvent(ContentDeletedEvent)
    private contentDeleted(event:ContentDeletedEvent) {
        Product.of<IPageState>(this)
            .next(deleteContent(event.index))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(PageThumbChangeEvent)
    private pageThumb(event:PageThumbChangeEvent) {
        Product.of<IPageState>(this)
            .next(updateThumbs(event.thumbs))
            .next(setThumb(event.setIndex))
            .next(removeThumb(event.removeIndex))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }

    @hostEvent(EditTabClickedEvent)
    private editTabClicked(event:EditTabClickedEvent) {
        Product.of<IPageState>(this)
            .next(setEditTab(event.tab))
            .requestUpdate(event);
    }

    @hostEvent(PageEditModeChangeEvent)
    private pageEditModeChange(event:PageEditModeChangeEvent) {
        Product.of<IPageState>(this)
            .next(setPageEditMode(event.inEditMode))
            .requestUpdate(event);
    }

    @hostEvent(AddContentEvent)
    private addContent(event:AddContentEvent) {
        Product.of<IPageState>(this)
            .next(addContent(event.contentType))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
}


const subscribeToPage = (pageController:PageController) => async (page:PageModel, initialLoad?:boolean) => {

    // happens if the page is deleted
    if (!page) {
        throw new NotFoundError("Page Not Found");
    }

    if (initialLoad === true) {
        // jch - testing
        // pageController.state = PageController.getDefaultState();
        // Product.of<IPageState>(pageController)
        //     .next(clearEditIndexes)
        //     .requestUpdate(`PageController.subscribeToPage("${page.pathname}")`);
        // await pageController.host.updateComplete;
    }

    console.debug("Setting page from database:", page.pathname);
    Product.of<IPageState>(pageController)
        .next(updatePageLoaded(page))
        .next(updatePageTemplate)
        .next(updateUserCanEdit)
        .next(updateUserCanAdd)
        .requestUpdate(`PageController.subscribeToPage("${page.pathname}")`);

    const pageLoadedEvent = new PageLoadedEvent();
    window.dispatchEvent(pageLoadedEvent);
    if (pageLoadedEvent.defaultPrevented === false) {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
};


const savePage = (editPageRepo:IEditPageRepo) => (product:Product<IPageState>) => {
    editPageRepo.savePage(product.getState().page);
};

const userCanEdit = (page:PageModel):boolean => {
    const currentUser = new HbCurrentUser();
    return currentUser.uid === page.authorUid
        || currentUser.authorize(UserAction.editAnyPage);
}

const updatePageLoaded = (page:PageModel) => (state:IPageState) => {
    state.isLoaded = true;
    state.page = page;
};

const updatePageTemplate = (state:IPageState) => {
    state.pageTemplate = pageTemplates.get(state.page.pageTemplate);
};

const updateUserCanEdit = (state:IPageState) => {
    state.currentUserCanEdit = userCanEdit(state.page);
};

const updateUserCanAdd = (state:IPageState) => {
    state.currentUserCanAdd = new HbCurrentUser().authorize(UserAction.authorPages);
}


const updateShowTitle = (showTitle:boolean) => (state:IPageState) => {
    state.page.showTitle = showTitle;
};

const updateShowSubtitle = (showSubtitle:boolean) => (state:IPageState) => {
    state.page.showSubtitle = showSubtitle;
};

const updateSubtitle = (subtitle:string) => (state:IPageState) => {
    state.page.subtitle = subtitle;
};

const updatePageSize = (size:PageSize) => (state:IPageState) => {
    state.page.pageSize = size;
};

const updatePageVisibility = (isVisible:boolean) => (state:IPageState) => {
    state.page.isVisible = isVisible;
};

const updatePageContent = (index:number, data:IContentType) => (state:IPageState) => {
    state.page.content[index] = data;
};

const moveContent = (index:number, moveUp:boolean) => (state:IPageState) => {
    const content = state.page.content;

    if ((moveUp && index === 0) || (!moveUp && index === content.length -1)) {
        return;
    }

    moveUp ? content.splice(index - 1, 0, content.splice(index, 1)[0]) :
        content.splice(index + 1, 0, content.splice(index, 1)[0]);
};

const deleteContent = (index:number) => (state:IPageState) => {
    state.page.content.splice(index, 1);
    state.activeContentIndex = -1;
    state.editableContentIndex = -1;
};


const removeThumb = (index?:number) => (state:IPageState) => {
    if (index === undefined) { return; }

    state.page.thumbUrls.splice(index, 1);
};

const setThumb = (index?:number) => (state:IPageState) => {
    if (index === undefined) { return; }

    state.page.thumbUrl = state.page.thumbUrls[index];
};


const updateThumbs = (thumbs?:Array<string>) => (state:IPageState) => { 
    if (!thumbs) { return; }

    state.page.thumbUrls.unshift(...thumbs);

    // using set makes sure they are unique
    const thumbUrls = [... new Set(state.page.thumbUrls)];
    state.page.thumbUrls = thumbUrls;

    // set the thumb if it is the default
    if (state.page.thumbUrls[0] && state.page.thumbUrl === pageTemplates.get(state.page.pageTemplate).defaultThumbUrl) {
        state.page.thumbUrl = state.page.thumbUrls[0];
    }
};


const setEditTab = (tab:string) => (state:IPageState) => {
    state.selectedEditTab = state.selectedEditTab === tab ? "" : tab;
};

const setContentActive = (options:ContentActiveChangeOptions) => (state:IPageState) => { 
    if (options.inEditMode) {
        state.editableContentIndex = options.contentIndex;
        state.activeContentIndex = options.contentIndex;
    } else if (options.isActive && state.editableContentIndex !== options.contentIndex) {
        state.activeContentIndex === options.contentIndex ?
            state.activeContentIndex = -1 :
            state.activeContentIndex = options.contentIndex;
        state.editableContentIndex = -1;
    } else if (state.editableContentIndex !== options.contentIndex || 
            (!options.inEditMode && !options.isActive)) {
        state.activeContentIndex = -1;
        state.editableContentIndex = -1;
    }
};

const addContent = (contentType:string) => (state:IPageState) => {
    state.page.content.push(contentTypes.get(contentType).defaultData); // jch - use method here?
    state.activeContentIndex = state.page.content.length - 1;
    state.editableContentIndex = -1;
};

const setPageEditMode = (inEditMode:boolean) => (state:IPageState) => {
    state.inEditMode = inEditMode;
    if (!inEditMode) {
        state.editableContentIndex = -1;
        state.activeContentIndex = -1;
    }
};

const clearEditIndexes = (state:IPageState) => {
    state.editableContentIndex = -1;
    state.activeContentIndex = -1;
};