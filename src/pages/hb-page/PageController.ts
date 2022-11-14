import { Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { HbCurrentUser, UserAction } from "../../domain/HbCurrentUser";
import { IContentType } from "../../domain/interfaces/DocumentInterfaces";
import { EditPageRepoKey, IEditPageRepo } from "../../domain/interfaces/PageInterfaces";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
import { HbPage } from "./hb-page";
import "../../domain/Pages/HbEditPageRepo";


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
        this.editPageRepo.subscribeToPage(this.host.pathname, subscribeToPage(this), this.abortController.signal);
    }
}


const subscribeToPage = (pageController:PageController) => (page:PageModel) => {
    Product.of<IPageState>(pageController)
        .next(updatePage(page))
        .next(updateUserCanEdit(page))
        .next(updateUserCanAdd)
        .requestUpdate("PageController.subscribeToPage");
};



const savePage = (editPageRepo:IEditPageRepo, page:PageModel) => (product:Product<IPageState>) => {
    editPageRepo.savePage(page);
};

const updateUserCanEdit = (page:PageModel) => (state:IPageState) => {
    state.currentUserCanEdit = userCanEdit(page);
};

const updateUserCanAdd = (state:IPageState) => {
    state.currentUserCanAdd = new HbCurrentUser().authorize(UserAction.authorDocuments);
}

const userCanEdit = (doc:PageModel):boolean => {
    const currentUser = new HbCurrentUser();
    return currentUser.uid === doc.authorUid
        || currentUser.authorize(UserAction.editAnyDocument);
}

const updatePage = (page:PageModel) => (state:IPageState) => {
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

const updateDocContent = (index:number, data:IContentType) => (state:IPageState) => {
    state.page.content[index] = data;
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