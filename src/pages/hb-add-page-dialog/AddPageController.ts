import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { ClientError } from "../../domain/Errors";
import { AddPageRepoKey, IAddPageRepo, IPageTemplateDescriptor } from "../../domain/interfaces/PageInterfaces";
import "../../domain/Pages/HbAddPageRepo";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";



export interface IAddPageState {
    pageTemplates: Array<IPageTemplateDescriptor>;
    pagePathnameError: string|null;
    pageIsValidMessage: string;
    pageTemplateIndex: number;
    title: string;
    pathname: string;
    canAdd: boolean;
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
        canAdd: false
    };

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
    const exists = await repo.pageExists(state.pathname);
    const message = exists ? "The page already exists, please select a different url" :
        "The page does not exist, you're good to go!";
    const error = exists ? "Url exists" : "";

    product
        .next(setAddPageError(error))
        .next(setPageIsValidMessage(message))
        .requestUpdate("HbAddPageRepo.validateNewPageOptions")
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
                .next(setAddPageError(error.message))
                .requestUpdate("AddPageController.addNewPage");
        }
        else {
            throw error;
        }
        return;
    }

    product.dispatchHostEvent(new PageAddedEvent(pageModel));
};


const setAddPageError = (error:string) => (state:IAddPageState) => {
    state.pagePathnameError = error;
};

const setTemplateIndex = (index:number) => (state:IAddPageState) => {
    state.pageTemplateIndex = index;
};

const setPageTitle = (title:string) => (state:IAddPageState) => {
    state.canAdd = title.length > 2;
    state.title = title;
};

const setPagePathname = (pathname:string) => (state:IAddPageState) => {
    state.pathname = pathname.toLowerCase();
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
    state.pathname = `/${PageModel.tokenize(state.title)}`;
};