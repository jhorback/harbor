import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { state } from "lit/decorators";
import { ClientError } from "../../domain/Errors";
import { IAddNewPageOptions, IAddPageRepo, IPageTemplateDescriptor } from "../../domain/interfaces/PageInterfaces";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";



export interface IAddPageState {
    pageTemplates: Array<IPageTemplateDescriptor>;
    addPageError: string|null;
    pageIsValidMessage: string;
    pageTemplate: string;
    title: string;
    pathname: string;
    canAdd: boolean;
}


/**
 * Dispatch when any of the options change.
 * Set validate to true to validate
 * the page can be added (i.e. with unique url).
 * Setting the title to an empty string will reset the state.
 */
export class AddPageOptionsChangedEvent extends Event {
    static eventType = "add-page-options-changed";
    options:IAddNewPageOptions;
    validate:boolean;
    constructor(options:IAddNewPageOptions, validate:boolean) {
        super(AddPageOptionsChangedEvent.eventType);
        this.options = options;
        this.validate = validate;
    }
}

/**
 * Attempts to add the page.
 * If successful, the {@link PageAddedEvent} will
 * be dispatched on the host element.
 */
export class AddNewPageEvent extends Event {
    static eventType = "add-new-page";
    options:IAddNewPageOptions;
    constructor(options:IAddNewPageOptions) {
        super(AddNewPageEvent.eventType, { bubbles: true });
        this.options = options;
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

    @stateProperty()
    state:IAddPageState =  {
        pageTemplates: pageTemplates.all(),
        addPageError: null,
        pageIsValidMessage: "",
        pageTemplate: "",
        title: "",
        pathname: "",
        canAdd: false
    };

    @hostEvent(AddPageOptionsChangedEvent)
    addPageOptionsChanged(event: AddPageOptionsChangedEvent) {
        // if "" reset error
        // otherwise do a name check
        // this.newPageTitle = event.value;
        // this.addButtonEnabled = this.newPageTitle.length > 2;
        event.options;
        event.validate;
    }

    @hostEvent(AddNewPageEvent)
    addNewPage(event:AddNewPageEvent) {

    }
}



const addNewPage = (repo:IAddPageRepo, options:IAddNewPageOptions) => async (product:Product<IAddPageState>) => {

    let pageModel:PageModel;

    try {
        pageModel = await repo.addPage(options);
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
    state.addPageError = error;
};