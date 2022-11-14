import { StateController, stateProperty } from "@domx/statecontroller";
import { IContentType } from "../../domain/interfaces/DocumentInterfaces";
import { PageModel } from "../../domain/Pages/PageModel";
import { HbPage } from "./hb-page";


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

    // @inject<IEditDocRepo>(EditDocRepoKey)
    // private editDocRepo!:IEditDocRepo;

    constructor(host:HbPage) {
        super(host);
    }
}