import { hostEvent, Product, StateController, stateProperty, windowEvent } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { HbCurrentUser, UserAction } from "../../domain/HbCurrentUser";
import { IContentType } from "../../domain/interfaces/DocumentInterfaces";
import { EditPageRepoKey, IEditPageRepo } from "../../domain/interfaces/PageInterfaces";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
import { HbPage } from "./hb-page";
import "../../domain/Pages/HbEditPageRepo";
import { HbCurrentUserChangedEvent } from "../../domain/HbAuth";


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


export interface IPageState {
    isLoaded: boolean;
    currentUserCanEdit: boolean;
    currentUserCanAdd: boolean;
    page:PageModel;
}

export class PageController extends StateController {

    @stateProperty()
    state:IPageState = {
        isLoaded: false,
        currentUserCanEdit: true,
        currentUserCanAdd: true,
        page: new PageModel()
    }

    @inject<IEditPageRepo>(EditPageRepoKey)
    private editPageRepo!:IEditPageRepo;

    public host:HbPage;

    constructor(host:HbPage) {
        super(host);
        this.host = host;
    }

    hostConnected() {
        super.hostConnected();
        this.editPageRepo.subscribeToPage(this.host.pathname,
            subscribeToPage(this), this.abortController.signal);
    }

    @windowEvent(HbCurrentUserChangedEvent, {capture: false})
    private currentUserChanged(event:HbCurrentUserChangedEvent) {
        Product.of<IPageState>(this)
            .next(updateUserCanEdit)
            .next(updateUserCanAdd)
            .requestUpdate(event);
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
            .tap(savePage(this.editDocRepo))
            .requestUpdate(event);
    }

    @hostEvent(UpdateSubtitleEvent)
    private updateSubtitle(event:UpdateSubtitleEvent) {
        Product.of<IPageState>(this)
            .next(updateSubtitle(event.subtitle))
            .tap(savePage(this.editDocRepo))
            .requestUpdate(event);
    }

    @hostEvent(UpdatePageContentEvent)
    private updatePageContent(event:UpdatePageContentEvent) {
        Product.of<IPageState>(this)
            .next(updatePageContent(event.index, event.state))
            .tap(savePage(this.editDocRepo))
            .requestUpdate(event);
    }

    @hostEvent(MovePageContentEvent)
    private moveContent(event:MovePageContentEvent) {
        Product.of<IPageState>(this)
            .next(moveContent(event.index, event.moveUp))
            .tap(savePage(this.editDocRepo))
            .requestUpdate(event);
    }

    @hostEvent(PageThumbChangeEvent)
    private pageThumb(event:PageThumbChangeEvent) {
        Product.of<IPageState>(this)
            .next(updateThumbs(event.thumbs))
            .next(setThumb(event.setIndex))
            .next(removeThumb(event.removeIndex))
            .tap(savePage(this.editDocRepo))
            .requestUpdate(event);
    }
}


const subscribeToPage = (pageController:PageController) => (page:PageModel) => {
    Product.of<IPageState>(pageController)
        .next(updatePageLoaded(page))
        .next(updateUserCanEdit)
        .next(updateUserCanAdd)
        .requestUpdate("PageController.subscribeToPage");
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