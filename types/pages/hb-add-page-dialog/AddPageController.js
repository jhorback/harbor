var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, StateController, stateProperty } from "@domx/statecontroller";
import { ClientError } from "../../domain/Errors";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
/**
 * Dispatch when any of the options change.
 * Set validate to true to validate
 * the page can be added (i.e. with unique url).
 * Setting the title to an empty string will reset the state.
 */
export class AddPageOptionsChangedEvent extends Event {
    constructor(options, validate) {
        super(AddPageOptionsChangedEvent.eventType);
        this.options = options;
        this.validate = validate;
    }
}
AddPageOptionsChangedEvent.eventType = "add-page-options-changed";
/**
 * Attempts to add the page.
 * If successful, the {@link PageAddedEvent} will
 * be dispatched on the host element.
 */
export class AddNewPageEvent extends Event {
    constructor(options) {
        super(AddNewPageEvent.eventType, { bubbles: true });
        this.options = options;
    }
}
AddNewPageEvent.eventType = "add-new-page";
/**
 * Dispatched when the page was successfully added
 */
export class PageAddedEvent extends Event {
    constructor(pageModel) {
        super(PageAddedEvent.eventType, { bubbles: true, composed: true });
        this.pageModel = pageModel;
    }
}
PageAddedEvent.eventType = "page-added";
export class AddPageController extends StateController {
    constructor() {
        super(...arguments);
        this.state = {
            pageTemplates: pageTemplates.all(),
            addPageError: null,
            pageIsValidMessage: "",
            pageTemplate: "",
            title: "",
            pathname: "",
            canAdd: false
        };
    }
    addPageOptionsChanged(event) {
        // if "" reset error
        // otherwise do a name check
        // this.newPageTitle = event.value;
        // this.addButtonEnabled = this.newPageTitle.length > 2;
        event.options;
        event.validate;
    }
    addNewPage(event) {
    }
}
__decorate([
    stateProperty()
], AddPageController.prototype, "state", void 0);
__decorate([
    hostEvent(AddPageOptionsChangedEvent)
], AddPageController.prototype, "addPageOptionsChanged", null);
__decorate([
    hostEvent(AddNewPageEvent)
], AddPageController.prototype, "addNewPage", null);
const addNewPage = (repo, options) => async (product) => {
    let pageModel;
    try {
        pageModel = await repo.addPage(options);
    }
    catch (error) {
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
const setAddPageError = (error) => (state) => {
    state.addPageError = error;
};
