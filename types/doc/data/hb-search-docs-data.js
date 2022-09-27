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
    connectedCallback() {
        super.connectedCallback();
    }
    addNewDocument(event) {
        const options = event.options;
        StateChange.of(this)
            .tap(searchDocuments(this.searchDocsRepo, options));
    }
};
SearchDocsData.defaultState = {};
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
    // alert("SEARCH DOCUMENTS");
    /*
    const searchText = event.detail.searchText.toUpperCase();
    const docRef = hb.db.collection("docs");
    const snapshot = await docRef.where("title_UPPERCASE", ">", searchText)
        .where("title_UPPERCASE", "<", `${searchText}z`)
        .get();
    const docs = snapshot.docs.map(d => d.data());
    this.set("docData.searchResults", docs);
    this.set("docData.noSearchResults", docs.length === 0);
    */
};
