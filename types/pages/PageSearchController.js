var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../domain/DependencyContainer/decorators";
import { SearchPagesRepoKey } from "../domain/interfaces/PageInterfaces";
import "../domain/Pages/HbSearchPagesRepo";
export class SearchPagesEvent extends Event {
    constructor(options) {
        super(SearchPagesEvent.eventType, { bubbles: true });
        this.options = options;
    }
}
SearchPagesEvent.eventType = "search-pages";
export class PageSearchController extends StateController {
    constructor() {
        super(...arguments);
        this.state = {
            list: [],
            isLoading: false,
            count: 0
        };
    }
    searchDocs(event) {
        const options = event.options;
        Product.of(this)
            .next(setIsLoading(true))
            .tap(searchPages(this.searchPagesRepo, options))
            .requestUpdate(event);
    }
}
__decorate([
    stateProperty()
], PageSearchController.prototype, "state", void 0);
__decorate([
    inject(SearchPagesRepoKey)
], PageSearchController.prototype, "searchPagesRepo", void 0);
__decorate([
    hostEvent(SearchPagesEvent)
], PageSearchController.prototype, "searchDocs", null);
const searchPages = (repo, options) => async (product) => {
    const pages = await repo.searchPages(options);
    product
        .next(updatePagesList(pages))
        .next(setIsLoading(false))
        .requestUpdate("PageSearchController.searchPages");
};
const updatePagesList = (pages) => (state) => {
    state.list = pages;
    state.count = pages.length;
};
const setIsLoading = (isLoading) => (state) => {
    state.isLoading = isLoading;
};
