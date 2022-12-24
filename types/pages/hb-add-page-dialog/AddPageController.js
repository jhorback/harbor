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
    static { this.eventType = "page-template-changed"; }
    constructor(index) {
        super(PageTemplateChangedEvent.eventType);
        this.index = index;
    }
}
export class PageTitleChangedEvent extends Event {
    static { this.eventType = "page-title-changed"; }
    constructor(title) {
        super(PageTitleChangedEvent.eventType);
        this.title = title;
    }
}
export class PagePathnameChangedEvent extends Event {
    static { this.eventType = "page-pathname-changed"; }
    constructor(pathname) {
        super(PagePathnameChangedEvent.eventType);
        this.pathname = pathname;
    }
}
export class ValidateNewPageOptionsEvent extends Event {
    static { this.eventType = "validate-new-page-options"; }
    constructor() {
        super(ValidateNewPageOptionsEvent.eventType);
    }
}
export class AddNewPageEvent extends Event {
    static { this.eventType = "add-new-page"; }
    constructor() {
        super(AddNewPageEvent.eventType);
    }
}
/**
 * Dispatched when the page was successfully added
 */
export class PageAddedEvent extends Event {
    static { this.eventType = "page-added"; }
    constructor(pageModel) {
        super(PageAddedEvent.eventType, { bubbles: true, composed: true });
        this.pageModel = pageModel;
    }
}
export class AddPageController extends StateController {
    constructor(host) {
        super(host);
        this.state = {
            pageTemplates: pageTemplates.all(),
            pagePathnameError: null,
            pageIsValidMessage: "",
            pageTemplateIndex: 0,
            title: "",
            pathname: "",
            canAdd: false,
            urlPrefix: ""
        };
        this.host = host;
    }
    hostConnected() {
        super.hostConnected();
        Product.of(this)
            .next(setUrlPrefix(this.host.urlPrefix))
            .next(setPagePathnameBasedOnTitle)
            .requestUpdate("AddPageController.hostConnected");
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
        .requestUpdate("HbAddPageRepo.validateNewPageOptions");
};
const setUrlPrefix = (urlPrefix) => (state) => {
    state.urlPrefix = urlPrefix;
};
const setCanAdd = (canAdd) => (state) => {
    state.canAdd = canAdd;
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
const setPagePathnameError = (error) => (state) => {
    state.pagePathnameError = error;
};
const setTemplateIndex = (index) => (state) => {
    state.pageTemplateIndex = index;
};
const setPageTitle = (title) => (state) => {
    state.canAdd = false;
    state.title = title;
};
const setPagePathname = (pathname) => (state) => {
    state.canAdd = false;
    state.pathname = pathname.toLowerCase().replace(/[^0-9a-z\-/]/g, '');
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
    state.canAdd = false;
    state.pathname = `${state.urlPrefix}/${PageModel.tokenize(state.title)}`;
};
