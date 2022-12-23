var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product, StateController, stateProperty, windowEvent } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { HbCurrentUser, UserAction } from "../../domain/HbCurrentUser";
import { EditPageRepoKey } from "../../domain/interfaces/PageInterfaces";
import { PageModel } from "../../domain/Pages/PageModel";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
import "../../domain/Pages/HbEditPageRepo";
import { HbCurrentUserChangedEvent } from "../../domain/HbAuth";
import { NotFoundError } from "../../domain/Errors";
import { contentTypes } from "../../domain/Pages/contentTypes";
/**
 * Dispatched when the page is loaded from the database
 * Calling preventDefault will keep the window from scrolling
 */
export class PageLoadedEvent extends Event {
    static { this.eventType = "page-loaded"; }
    constructor() {
        super(PageLoadedEvent.eventType, { bubbles: true, composed: true, cancelable: true });
    }
}
export class RequestPageEvent extends Event {
    static { this.eventType = "request-page"; }
    constructor() {
        super(RequestPageEvent.eventType);
    }
}
export class UpdateShowTitleEvent extends Event {
    static { this.eventType = "update-show-title"; }
    constructor(showTitle) {
        super(UpdateShowTitleEvent.eventType);
        this.showTitle = showTitle;
    }
}
export class UpdateShowSubtitleEvent extends Event {
    static { this.eventType = "update-show-subtitle"; }
    constructor(showSubtitle) {
        super(UpdateShowSubtitleEvent.eventType);
        this.showSubtitle = showSubtitle;
    }
}
export class UpdatePageVisibilityEvent extends Event {
    static { this.eventType = "update-page-visibility"; }
    constructor(isVisible) {
        super(UpdatePageVisibilityEvent.eventType);
        this.isVisible = isVisible;
    }
}
export class UpdateSubtitleEvent extends Event {
    static { this.eventType = "update-subtitle"; }
    constructor(subtitle) {
        super(UpdateSubtitleEvent.eventType);
        this.subtitle = subtitle;
    }
}
export class UpdatePageSizeEvent extends Event {
    static { this.eventType = "update-page-size"; }
    constructor(size) {
        super(UpdatePageSizeEvent.eventType);
        this.size = size;
    }
}
export class UpdatePageContentEvent extends Event {
    static { this.eventType = "update-page-content"; }
    constructor(index, state) {
        super(UpdatePageContentEvent.eventType, { bubbles: true, composed: true });
        if (!(index > -1)) {
            throw new Error("index must be 0 or greater");
        }
        this.index = index;
        this.state = state;
    }
}
export class MovePageContentEvent extends Event {
    static { this.eventType = "move-page-content"; }
    constructor(index, moveUp) {
        super(MovePageContentEvent.eventType, { bubbles: true, composed: true });
        this.index = index;
        this.moveUp = moveUp;
    }
}
export class PageThumbChangeEvent extends Event {
    static { this.eventType = "page-thumb-change"; }
    constructor(options) {
        super(PageThumbChangeEvent.eventType, { bubbles: true, composed: true });
        this.thumbs = options.thumbs;
        this.setIndex = options.setIndex;
        this.removeIndex = options.removeIndex;
    }
}
export class PageEditModeChangeEvent extends Event {
    static { this.eventType = "page-edit-mode-change"; }
    constructor(inEditMode) {
        super(PageEditModeChangeEvent.eventType);
        this.inEditMode = inEditMode;
    }
}
export class EditTabClickedEvent extends Event {
    static { this.eventType = "edit-tab-clicked"; }
    constructor(tab) {
        super(EditTabClickedEvent.eventType);
        this.tab = tab;
    }
}
export class ContentActiveChangeEvent extends Event {
    static { this.eventType = "content-active-change"; }
    constructor(options) {
        super(ContentActiveChangeEvent.eventType, { bubbles: true, composed: true });
        this.options = options;
    }
}
export class ContentDeletedEvent extends Event {
    static { this.eventType = "content-deleted"; }
    constructor(index) {
        super(ContentDeletedEvent.eventType, { bubbles: true, composed: true });
        this.index = index;
    }
}
export class AddContentEvent extends Event {
    static { this.eventType = "add-content"; }
    constructor(contentType) {
        super(AddContentEvent.eventType);
        this.contentType = contentType;
    }
}
export class PageController extends StateController {
    static getDefaultState() {
        return {
            isLoaded: false,
            page: new PageModel(),
            currentUserCanEdit: true,
            currentUserCanAdd: true,
            selectedEditTab: "",
            inEditMode: false,
            activeContentIndex: -1,
            editableContentIndex: -1,
            pageTemplate: pageTemplates.get("page")
        };
    }
    ;
    constructor(host) {
        super(host);
        this.state = PageController.getDefaultState();
        this.host = host;
    }
    currentUserChanged(event) {
        Product.of(this)
            .next(updateUserCanEdit)
            .next(updateUserCanAdd)
            .requestUpdate(event);
    }
    requestPage(event) {
        this.refreshState();
        this.editPageRepo.subscribeToPage(this.host.pathname, subscribeToPage(this), this.abortController.signal);
    }
    updateShowTitle(event) {
        Product.of(this)
            .next(updateShowTitle(event.showTitle))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    updateShowSubtitle(event) {
        Product.of(this)
            .next(updateShowSubtitle(event.showSubtitle))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    updateSubtitle(event) {
        Product.of(this)
            .next(updateSubtitle(event.subtitle))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    updatePageSize(event) {
        Product.of(this)
            .next(updatePageSize(event.size))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    updatePageVisibility(event) {
        Product.of(this)
            .next(updatePageVisibility(event.isVisible))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    updatePageContent(event) {
        Product.of(this)
            .next(updatePageContent(event.index, event.state))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    moveContent(event) {
        Product.of(this)
            .next(moveContent(event.index, event.moveUp))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    contentActiveChange(event) {
        Product.of(this)
            .next(setContentActive(event.options))
            .requestUpdate(event);
    }
    contentDeleted(event) {
        Product.of(this)
            .next(deleteContent(event.index))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    pageThumb(event) {
        Product.of(this)
            .next(updateThumbs(event.thumbs))
            .next(setThumb(event.setIndex))
            .next(removeThumb(event.removeIndex))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
    editTabClicked(event) {
        Product.of(this)
            .next(setEditTab(event.tab))
            .requestUpdate(event);
    }
    pageEditModeChange(event) {
        Product.of(this)
            .next(setPageEditMode(event.inEditMode))
            .requestUpdate(event);
    }
    addContent(event) {
        Product.of(this)
            .next(addContent(event.contentType))
            .tap(savePage(this.editPageRepo))
            .requestUpdate(event);
    }
}
__decorate([
    stateProperty()
], PageController.prototype, "state", void 0);
__decorate([
    inject(EditPageRepoKey)
], PageController.prototype, "editPageRepo", void 0);
__decorate([
    windowEvent(HbCurrentUserChangedEvent, { capture: false })
], PageController.prototype, "currentUserChanged", null);
__decorate([
    hostEvent(RequestPageEvent)
], PageController.prototype, "requestPage", null);
__decorate([
    hostEvent(UpdateShowTitleEvent)
], PageController.prototype, "updateShowTitle", null);
__decorate([
    hostEvent(UpdateShowSubtitleEvent)
], PageController.prototype, "updateShowSubtitle", null);
__decorate([
    hostEvent(UpdateSubtitleEvent)
], PageController.prototype, "updateSubtitle", null);
__decorate([
    hostEvent(UpdatePageSizeEvent)
], PageController.prototype, "updatePageSize", null);
__decorate([
    hostEvent(UpdatePageVisibilityEvent)
], PageController.prototype, "updatePageVisibility", null);
__decorate([
    hostEvent(UpdatePageContentEvent)
], PageController.prototype, "updatePageContent", null);
__decorate([
    hostEvent(MovePageContentEvent)
], PageController.prototype, "moveContent", null);
__decorate([
    hostEvent(ContentActiveChangeEvent)
], PageController.prototype, "contentActiveChange", null);
__decorate([
    hostEvent(ContentDeletedEvent)
], PageController.prototype, "contentDeleted", null);
__decorate([
    hostEvent(PageThumbChangeEvent)
], PageController.prototype, "pageThumb", null);
__decorate([
    hostEvent(EditTabClickedEvent)
], PageController.prototype, "editTabClicked", null);
__decorate([
    hostEvent(PageEditModeChangeEvent)
], PageController.prototype, "pageEditModeChange", null);
__decorate([
    hostEvent(AddContentEvent)
], PageController.prototype, "addContent", null);
const subscribeToPage = (pageController) => async (page, initialLoad) => {
    // happens if the page is deleted
    if (!page) {
        throw new NotFoundError("Page Not Found");
    }
    if (initialLoad === true) {
        // pageController.state = PageController.getDefaultState();
        // Product.of<IPageState>(pageController)
        //     .next(clearEditIndexes)
        //     .requestUpdate(`PageController.subscribeToPage("${page.pathname}")`);
        // await pageController.host.updateComplete;
    }
    console.debug("Setting page from database:", page.pathname);
    Product.of(pageController)
        .next(updatePageLoaded(page))
        .next(updatePageTemplate)
        .next(updateUserCanEdit)
        .next(updateUserCanAdd)
        .requestUpdate(`PageController.subscribeToPage("${page.pathname}")`);
    const pageLoadedEvent = new PageLoadedEvent();
    window.dispatchEvent(pageLoadedEvent);
    if (initialLoad && pageLoadedEvent.defaultPrevented === false) {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth"
        });
    }
};
const savePage = (editPageRepo) => (product) => {
    editPageRepo.savePage(product.getState().page);
};
const userCanEdit = (page) => {
    const currentUser = new HbCurrentUser();
    return currentUser.uid === page.authorUid
        || currentUser.authorize(UserAction.editAnyPage);
};
const updatePageLoaded = (page) => (state) => {
    state.isLoaded = true;
    state.page = page;
};
const updatePageTemplate = (state) => {
    state.pageTemplate = pageTemplates.get(state.page.pageTemplate);
};
const updateUserCanEdit = (state) => {
    state.currentUserCanEdit = userCanEdit(state.page);
};
const updateUserCanAdd = (state) => {
    state.currentUserCanAdd = new HbCurrentUser().authorize(UserAction.authorPages);
};
const updateShowTitle = (showTitle) => (state) => {
    state.page.showTitle = showTitle;
};
const updateShowSubtitle = (showSubtitle) => (state) => {
    state.page.showSubtitle = showSubtitle;
};
const updateSubtitle = (subtitle) => (state) => {
    state.page.subtitle = subtitle;
};
const updatePageSize = (size) => (state) => {
    state.page.pageSize = size;
};
const updatePageVisibility = (isVisible) => (state) => {
    state.page.isVisible = isVisible;
};
const updatePageContent = (index, data) => (state) => {
    state.page.content[index] = data;
};
const moveContent = (index, moveUp) => (state) => {
    const content = state.page.content;
    if ((moveUp && index === 0) || (!moveUp && index === content.length - 1)) {
        return;
    }
    moveUp ? content.splice(index - 1, 0, content.splice(index, 1)[0]) :
        content.splice(index + 1, 0, content.splice(index, 1)[0]);
};
const deleteContent = (index) => (state) => {
    state.page.content.splice(index, 1);
    state.activeContentIndex = -1;
    state.editableContentIndex = -1;
};
const removeThumb = (index) => (state) => {
    if (index === undefined) {
        return;
    }
    state.page.thumbUrls.splice(index, 1);
};
const setThumb = (index) => (state) => {
    if (index === undefined) {
        return;
    }
    state.page.thumbUrl = state.page.thumbUrls[index];
};
const updateThumbs = (thumbs) => (state) => {
    if (!thumbs) {
        return;
    }
    state.page.thumbUrls.unshift(...thumbs);
    // using set makes sure they are unique
    const thumbUrls = [...new Set(state.page.thumbUrls)];
    state.page.thumbUrls = thumbUrls;
    // set the thumb if it is the default
    if (state.page.thumbUrls[0] && state.page.thumbUrl === pageTemplates.get(state.page.pageTemplate).defaultThumbUrl) {
        state.page.thumbUrl = state.page.thumbUrls[0];
    }
};
const setEditTab = (tab) => (state) => {
    state.selectedEditTab = state.selectedEditTab === tab ? "" : tab;
};
const setContentActive = (options) => (state) => {
    if (options.inEditMode) {
        state.editableContentIndex = options.contentIndex;
        state.activeContentIndex = options.contentIndex;
    }
    else if (options.isActive && state.editableContentIndex !== options.contentIndex) {
        state.activeContentIndex === options.contentIndex ?
            state.activeContentIndex = -1 :
            state.activeContentIndex = options.contentIndex;
        state.editableContentIndex = -1;
    }
    else if (state.editableContentIndex !== options.contentIndex ||
        (!options.inEditMode && !options.isActive)) {
        state.activeContentIndex = -1;
        state.editableContentIndex = -1;
    }
};
const addContent = (contentType) => (state) => {
    state.page.content.push(contentTypes.get(contentType).defaultData); // jch - use method here?
    state.activeContentIndex = state.page.content.length - 1;
    state.editableContentIndex = -1;
};
const setPageEditMode = (inEditMode) => (state) => {
    state.inEditMode = inEditMode;
    if (!inEditMode) {
        state.editableContentIndex = -1;
        state.activeContentIndex = -1;
    }
};
const clearEditIndexes = (state) => {
    state.editableContentIndex = -1;
    state.activeContentIndex = -1;
};
