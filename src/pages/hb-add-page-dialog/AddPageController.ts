import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { ClientError } from "../../domain/Errors";
import { AddPageRepoKey, IAddPageRepo, IPageTemplateDescriptor } from "../../domain/interfaces/PageInterfaces";
import "../../domain/Pages/HbAddPageRepo";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
import { AddPageDialog } from "./hb-add-page-dialog";



export interface IAddPageState {
    pageTemplates: Array<IPageTemplateDescriptor>;
    pagePathnameError: string|null;
    pageIsValidMessage: string;
    pageTemplateIndex: number;
    title: string;
    pathname: string;
    canAdd: boolean;
    urlPrefix: string
}


export class PageTemplateChangedEvent extends Event {
    static eventType = "page-template-changed";
    index:number;
    constructor(index:number) {
        super(PageTemplateChangedEvent.eventType);
        this.index = index;
    }
}

export class PageTitleChangedEvent extends Event {
    static eventType = "page-title-changed";
    title:string;
    constructor(title:string) {
        super(PageTitleChangedEvent.eventType);
        this.title = title;
    }
}

export class PagePathnameChangedEvent extends Event {
    static eventType = "page-pathname-changed";
    pathname:string;
    constructor(pathname:string) {
        super(PagePathnameChangedEvent.eventType);
        this.pathname = pathname;
    }
}

export class ValidateNewPageOptionsEvent extends Event {
    static eventType = "validate-new-page-options";
    constructor() {
        super(ValidateNewPageOptionsEvent.eventType);
    }
}

export class AddNewPageEvent extends Event {
    static eventType = "add-new-page";
    constructor() {
        super(AddNewPageEvent.eventType);
    }
}

/**
 * Dispatched when the page was successfully added
 */
export class PageAddedEvent extends Event {
    static eventType = "page-added";
    pageModel:PageModel;
    constructor(pageModel:PageModel) {
        super(PageAddedEvent.eventType, {bubbles: true, composed: true});
        this.pageModel = pageModel;
    }
}

export class AddPageController extends StateController {

    @inject(AddPageRepoKey)
    addPageRepo!:IAddPageRepo;

    @stateProperty()
    state:IAddPageState =  {
        pageTemplates: pageTemplates.all(),
        pagePathnameError: null,
        pageIsValidMessage: "",
        pageTemplateIndex: 0,
        title: "",
        pathname: "",
        canAdd: false,
        urlPrefix: ""
    };

    host:AddPageDialog;

    constructor(host:AddPageDialog) {
        super(host);
        this.host = host;
    }

    hostConnected(){
        super.hostConnected();
        Product.of<IAddPageState>(this)
            .next(setUrlPrefix(this.host.urlPrefix))
            .next(setPagePathnameBasedOnTitle)
            .requestUpdate("AddPageController.hostConnected");
    }

    @hostEvent(PageTemplateChangedEvent)
    pageTemplateChanged(event: PageTemplateChangedEvent) {
        Product.of<IAddPageState>(this)
            .next(setTemplateIndex(event.index))
            .requestUpdate(event);
    }

    @hostEvent(PageTitleChangedEvent)
    pageTitleChanged(event: PageTitleChangedEvent) {
        Product.of<IAddPageState>(this)
            .next(clearPageIsValidMessage)
            .next(clearPagePathnameError)            
            .next(setPageTitle(event.title))
            .next(setPagePathnameBasedOnTitle)
            .requestUpdate(event);
    }

    @hostEvent(PagePathnameChangedEvent)
    pagePathnameChanged(event:PagePathnameChangedEvent) {
        Product.of<IAddPageState>(this)
            .next(clearPageIsValidMessage)
            .next(clearPagePathnameError)
            .next(setPagePathname(event.pathname))
            .requestUpdate(event);
    }

    @hostEvent(ValidateNewPageOptionsEvent)
    validateNewPageOptions(event:ValidateNewPageOptionsEvent) {
        Product.of<IAddPageState>(this)
            .tap(validateNewPageOptions(this.addPageRepo));
    }

    @hostEvent(AddNewPageEvent)
    addNewPage(event:AddNewPageEvent) {
        Product.of<IAddPageState>(this)
            .tap(addNewPage(this.addPageRepo));
    }
}

const validateNewPageOptions = (repo:IAddPageRepo) => async (product:Product<IAddPageState>) => {
    const state = product.getState();

    let pagePathnameError = "";
    let pageIsValidMessage = "";
    let canAdd = true;

    if (state.title.length < 3) {
        canAdd = false;
        pageIsValidMessage = "The title must be at least 3 characters long.";
    }

    if (state.pathname.indexOf("/") !== 0) {
        canAdd = false;
        pagePathnameError = "The page URL must begin with a forward slash: \"/\"";
    }

    if (canAdd) {
        const exists = await repo.pageExists(state.pathname);
        pageIsValidMessage = exists ? "The page already exists, please select a different url" :
            "The page is valid, you're good to go!";
        pagePathnameError = exists ? "Url exists" : "";
        canAdd = !exists;
    }

    product
        .next(setPagePathnameError(pagePathnameError))
        .next(setPageIsValidMessage(pageIsValidMessage))
        .next(setCanAdd(canAdd))
        .requestUpdate("HbAddPageRepo.validateNewPageOptions")
};


const setUrlPrefix = (urlPrefix:string)  => (state:IAddPageState) => {
    state.urlPrefix = urlPrefix;
};

const setCanAdd = (canAdd:boolean) => (state:IAddPageState) => {
    state.canAdd = canAdd;
};


const addNewPage = (repo:IAddPageRepo) => async (product:Product<IAddPageState>) => {

    let pageModel:PageModel;

    try {
        const state = product.getState();
        pageModel = await repo.addPage({
            pageTemplate: state.pageTemplates[state.pageTemplateIndex].key,
            title: state.title,
            pathname: state.pathname
        });
    }
    catch(error:any) {
        if (error instanceof ClientError) {
            product
                .next(setPagePathnameError(error.message))
                .requestUpdate("AddPageController.addNewPage");
        }
        else {
            throw error;
        }
        return;
    }

    product.dispatchHostEvent(new PageAddedEvent(pageModel));
};


const setPagePathnameError = (error:string) => (state:IAddPageState) => {
    state.pagePathnameError = error;
};

const setTemplateIndex = (index:number) => (state:IAddPageState) => {
    state.pageTemplateIndex = index;
};

const setPageTitle = (title:string) => (state:IAddPageState) => {
    state.canAdd = false;
    state.title = title;
};

const setPagePathname = (pathname:string) => (state:IAddPageState) => {
    state.canAdd = false;
    state.pathname = pathname.toLowerCase().replace(/[^0-9a-z\-/]/g,'');
};

const clearPageIsValidMessage = (state:IAddPageState) => {
    state.pageIsValidMessage = "";
};

const setPageIsValidMessage = (message:string) => (state:IAddPageState) => {
    state.pageIsValidMessage = message;
};

const clearPagePathnameError = (state:IAddPageState) => {
    state.pagePathnameError = "";
};

const setPagePathnameBasedOnTitle = (state:IAddPageState) => {
    state.canAdd = false;
    state.pathname = `${state.urlPrefix}/${PageModel.tokenize(state.title)}`;
};