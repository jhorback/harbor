import { hostEvent, Product, StateController, stateProperty, windowEvent } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { HbCurrentUser, UserAction } from "../../domain/HbCurrentUser";
import { IContentType } from "../../domain/interfaces/PageInterfaces";
import { EditPageRepoKey, IEditPageRepo } from "../../domain/interfaces/PageInterfaces";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
import "../../domain/Pages/HbEditPageRepo";
import { HbCurrentUserChangedEvent } from "../../domain/HbAuth";
import { LitElement } from "lit";


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

export class UpdateSubtitleEvent extends Event {
    static eventType = "update-subtitle";
    subtitle:string;
    constructor(subtitle:string) {
        super(UpdateSubtitleEvent.eventType);
        this.subtitle = subtitle;
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


export interface IPageState {
    isLoaded: boolean;
    page:PageModel;
    currentUserCanEdit: boolean;
    currentUserCanAdd: boolean;
    selectedEditTab: string;
    inEditMode: boolean;
    activeContentIndex: number;
    editableContentIndex: number;
}

export interface IPageElement extends LitElement {
    pathname:string;
    stateId:string;
}

export class PageController extends StateController {

    @stateProperty()
    state:IPageState = {
        isLoaded: false,
        page: new PageModel(),
        currentUserCanEdit: true,
        currentUserCanAdd: true,
        selectedEditTab: "",
        inEditMode: false,
        activeContentIndex: -1,
        editableContentIndex: -1
    };

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

    @hostEvent(ContentActiveChangeEvent)
    private contentActiveChange(event:ContentActiveChangeEvent) {
        Product.of<IPageState>(this)
            .next(setContentActive(event.options))
            .requestUpdate(event);
    }
}


const subscribeToPage = (pageController:PageController) => (page:PageModel) => {
    Product.of<IPageState>(pageController)
        .next(updatePageLoaded(page))
        .next(updateUserCanEdit)
        .next(updateUserCanAdd)
        .requestUpdate(`PageController.subscribeToPage("${page.pathname}")`);
};



const savePage = (editPageRepo:IEditPageRepo) => (product:Product<IPageState>) => {
    editPageRepo.savePage(product.getState().page);
};

const updateUserCanEdit = (state:IPageState) => {
    state.currentUserCanEdit = userCanEdit(state.page);
};

const updateUserCanAdd = (state:IPageState) => {
    state.currentUserCanAdd = new HbCurrentUser().authorize(UserAction.authorDocuments);
}

const userCanEdit = (page:PageModel):boolean => {
    const currentUser = new HbCurrentUser();
    return currentUser.uid === page.authorUid
        || currentUser.authorize(UserAction.editAnyDocument);
}

const updatePageLoaded = (page:PageModel) => (state:IPageState) => {
    state.isLoaded = true;
    state.page = page;
};



const updateShowTitle = (showTitle:boolean) => (state:IPageState) => {
    state.page.showTitle = showTitle;
};

const updateShowSubtitle = (showSubtitle:boolean) => (state:IPageState) => {
    state.page.showSubtitle = showSubtitle;
};

const updateSubtitle = (subtitle:string) => (state:IPageState) => {
    state.page.subtitle = subtitle;
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
    state.editableContentIndex = options.inEditMode ? options.contentIndex : -1;
    state.activeContentIndex = options.isActive ? options.contentIndex : -1;
};


const setPageEditMode = (inEditMode:boolean) => (state:IPageState) => {
    state.inEditMode = inEditMode;
    if (!inEditMode) {
        state.editableContentIndex = -1;
        state.activeContentIndex = -1;
    }
};