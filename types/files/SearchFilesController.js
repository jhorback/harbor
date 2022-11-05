var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../domain/DependencyContainer/decorators";
import { SearchFilesRepoKey } from "../domain/interfaces/FileInterfaces";
export class SearchFilesEvent extends Event {
    constructor(options) {
        super(SearchFilesEvent.eventType, { bubbles: true });
        this.options = options;
    }
}
SearchFilesEvent.eventType = "search-files";
export class SearchFilesController extends StateController {
    constructor() {
        super(...arguments);
        this.state = {
            list: [],
            isLoading: false,
            count: 0
        };
    }
    searchFiles(event) {
        const options = event.options;
        Product.of(this, "state")
            .next(setIsLoading(true))
            .tap(searchDocuments(this.searchDocsRepo, options))
            .requestUpdate(event);
    }
}
__decorate([
    stateProperty()
], SearchFilesController.prototype, "state", void 0);
__decorate([
    inject(SearchFilesRepoKey)
], SearchFilesController.prototype, "searchDocsRepo", void 0);
__decorate([
    hostEvent(SearchFilesEvent)
], SearchFilesController.prototype, "searchFiles", null);
const searchDocuments = (repo, options) => async (product) => {
    const files = await repo.searchFiles(options);
    product
        .next(updateFilesList(files))
        .next(setIsLoading(false))
        .requestUpdate("searchDocuments");
};
const updateFilesList = (files) => (state) => {
    state.list = files;
    state.count = files.length;
};
const setIsLoading = (isLoading) => (state) => {
    state.isLoading = isLoading;
};
