var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SearchFilesData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { SearchFilesRepoKey } from "../../domain/interfaces/FileInterfaces";
import "../../domain/Files/HbSearchFilesRepo";
export class SearchFilesEvent extends Event {
    constructor(options) {
        super(SearchFilesEvent.eventType, { bubbles: true });
        this.options = options;
    }
}
SearchFilesEvent.eventType = "search-files";
let SearchFilesData = SearchFilesData_1 = class SearchFilesData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = SearchFilesData_1.defaultState;
    }
    searchFiles(event) {
        const options = event.options;
        StateChange.of(this)
            .next(setIsLoading(true))
            .tap(searchDocuments(this.searchDocsRepo, options))
            .dispatch();
    }
};
SearchFilesData.defaultState = {
    list: [],
    isLoading: false,
    count: 0
};
__decorate([
    dataProperty()
], SearchFilesData.prototype, "state", void 0);
__decorate([
    inject(SearchFilesRepoKey)
], SearchFilesData.prototype, "searchDocsRepo", void 0);
__decorate([
    event(SearchFilesEvent.eventType)
], SearchFilesData.prototype, "searchFiles", null);
SearchFilesData = SearchFilesData_1 = __decorate([
    customDataElement("hb-search-files-data", {
        eventsListenAt: "parent"
    })
], SearchFilesData);
export { SearchFilesData };
const searchDocuments = (repo, options) => async (stateChange) => {
    const files = await repo.searchFiles(options);
    stateChange
        .next(updateFilesList(files))
        .next(setIsLoading(false))
        .dispatch();
};
const updateFilesList = (files) => (state) => {
    state.list = files;
    state.count = files.length;
};
const setIsLoading = (isLoading) => (state) => {
    state.isLoading = isLoading;
};
