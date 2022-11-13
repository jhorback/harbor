var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { ClientError } from "../../domain/Errors";
import { AddPageRepoKey } from "../../domain/interfaces/PageInterfaces";
import "../../domain/Pages/HbAddPageRepo";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
export class PageTemplateChangedEvent extends Event {
    constructor(index) {
        super(PageTemplateChangedEvent.eventType);
        this.index = index;
    }
}
PageTemplateChangedEvent.eventType = "page-template-changed";
export class PageTitleChangedEvent extends Event {
    constructor(title) {
        super(PageTitleChangedEvent.eventType);
        this.title = title;
    }
}
PageTitleChangedEvent.eventType = "page-title-changed";
export class PagePathnameChangedEvent extends Event {
    constructor(pathname) {
        super(PagePathnameChangedEvent.eventType);
        this.pathname = pathname;
    }
}
PagePathnameChangedEvent.eventType = "page-pathname-changed";
export class ValidateNewPageOptionsEvent extends Event {
    constructor() {
        super(ValidateNewPageOptionsEvent.eventType);
    }
}
ValidateNewPageOptionsEvent.eventType = "validate-new-page-options";
export class AddNewPageEvent extends Event {
    constructor() {
        super(AddNewPageEvent.eventType);
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
            pagePathnameError: null,
            pageIsValidMessage: "",
            pageTemplateIndex: 0,
            title: "",
            pathname: "",
            canAdd: false
        };
    }
    pageTemplateChanged(event) {
        Product.of(this)
            .next(setTemplateIndex(event.index))
            .requestUpdate(event);
    }
    pageTitleChanged(event) {
        Product.of(this)
            .next(clearPageIsValidMessage)
            .next(clearPagePathnameError)
            .next(setPageTitle(event.title))
            .next(setPagePathnameBasedOnTitle)
            .requestUpdate(event);
    }
    pagePathnameChanged(event) {
        Product.of(this)
            .next(clearPageIsValidMessage)
            .next(clearPagePathnameError)
            .next(setPagePathname(event.pathname))
            .requestUpdate(event);
    }
    validateNewPageOptions(event) {
        Product.of(this)
            .tap(validateNewPageOptions(this.addPageRepo));
    }
    addNewPage(event) {
        Product.of(this)
            .tap(addNewPage(this.addPageRepo));
    }
}
__decorate([
    inject(AddPageRepoKey)
], AddPageController.prototype, "addPageRepo", void 0);
__decorate([
    stateProperty()
], AddPageController.prototype, "state", void 0);
__decorate([
    hostEvent(PageTemplateChangedEvent)
], AddPageController.prototype, "pageTemplateChanged", null);
__decorate([
    hostEvent(PageTitleChangedEvent)
], AddPageController.prototype, "pageTitleChanged", null);
__decorate([
    hostEvent(PagePathnameChangedEvent)
], AddPageController.prototype, "pagePathnameChanged", null);
__decorate([
    hostEvent(ValidateNewPageOptionsEvent)
], AddPageController.prototype, "validateNewPageOptions", null);
__decorate([
    hostEvent(AddNewPageEvent)
], AddPageController.prototype, "addNewPage", null);
const validateNewPageOptions = (repo) => async (product) => {
    const state = product.getState();
    const exists = await repo.pageExists(state.pathname);
    const message = exists ? "The page already exists, please select a different url" :
        "The page does not exist, you're good to go!";
    const error = exists ? "Url exists" : "";
    product
        .next(setAddPageError(error))
        .next(setPageIsValidMessage(message))
        .requestUpdate("HbAddPageRepo.validateNewPageOptions");
};
const addNewPage = (repo) => async (product) => {
    let pageModel;
    try {
        const state = product.getState();
        pageModel = await repo.addPage({
            pageTemplate: state.pageTemplates[state.pageTemplateIndex].key,
            title: state.title,
            pathname: state.pathname
        });
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
    state.pagePathnameError = error;
};
const setTemplateIndex = (index) => (state) => {
    state.pageTemplateIndex = index;
};
const setPageTitle = (title) => (state) => {
    state.canAdd = title.length > 2;
    state.title = title;
};
const setPagePathname = (pathname) => (state) => {
    state.pathname = pathname.toLowerCase();
};
const clearPageIsValidMessage = (state) => {
    state.pageIsValidMessage = "";
};
const setPageIsValidMessage = (message) => (state) => {
    state.pageIsValidMessage = message;
};
const clearPagePathnameError = (state) => {
    state.pagePathnameError = "";
};
const setPagePathnameBasedOnTitle = (state) => {
    state.pathname = `/${PageModel.tokenize(state.title)}`;
};
