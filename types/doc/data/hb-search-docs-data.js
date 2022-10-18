var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SearchDocsData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { SearchDocsRepoKey } from "../../domain/interfaces/DocumentInterfaces";
import "../../domain/Doc/HbSearchDocsRepo";
export class SearchDocsEvent extends Event {
    constructor(options) {
        super(SearchDocsEvent.eventType, { bubbles: true });
        this.options = options;
    }
}
SearchDocsEvent.eventType = "search-docs";
let SearchDocsData = SearchDocsData_1 = class SearchDocsData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = SearchDocsData_1.defaultState;
    }
    addNewDocument(event) {
        const options = event.options;
        StateChange.of(this)
            .next(setIsLoading(true))
            .tap(searchDocuments(this.searchDocsRepo, options))
            .dispatch();
    }
};
SearchDocsData.defaultState = {
    list: [],
    isLoading: false,
    count: 0
};
__decorate([
    dataProperty()
], SearchDocsData.prototype, "state", void 0);
__decorate([
    inject(SearchDocsRepoKey)
], SearchDocsData.prototype, "searchDocsRepo", void 0);
__decorate([
    event(SearchDocsEvent.eventType)
], SearchDocsData.prototype, "addNewDocument", null);
SearchDocsData = SearchDocsData_1 = __decorate([
    customDataElement("hb-search-docs-data", {
        eventsListenAt: "parent"
    })
], SearchDocsData);
export { SearchDocsData };
const searchDocuments = (repo, options) => async (stateChange) => {
    const docs = await repo.searchDocs(options);
    stateChange
        .next(updateDocsList(docs))
        .next(setIsLoading(false))
        .dispatch();
};
const updateDocsList = (docs) => (state) => {
    state.list = docs;
    state.count = docs.length;
};
const setIsLoading = (isLoading) => (state) => {
    state.isLoading = isLoading;
};
