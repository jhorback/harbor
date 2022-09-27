var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SearchDocumentsData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { AddDocRepoKey } from "../../domain/interfaces/DocumentInterfaces";
import { docTypes } from "../../domain/Doc/docTypes";
import "../../domain/Doc/HbAddDocRepo";
import { ClientError } from "../../domain/ClientError";
let SearchDocumentsData = SearchDocumentsData_1 = class SearchDocumentsData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = SearchDocumentsData_1.defaultState;
    }
    connectedCallback() {
        super.connectedCallback();
        StateChange.of(this)
            .next(requestDocTypes)
            .dispatch();
    }
    addNewDocument(event) {
        const options = event.options;
        StateChange.of(this)
            .tap(addNewDocument(this.addDocRepo, options));
    }
};
SearchDocumentsData.defaultState = {};
__decorate([
    dataProperty()
], SearchDocumentsData.prototype, "state", void 0);
__decorate([
    inject(AddDocRepoKey)
], SearchDocumentsData.prototype, "addDocRepo", void 0);
__decorate([
    event(AddNewDocumentEvent.eventType)
], SearchDocumentsData.prototype, "addNewDocument", null);
SearchDocumentsData = SearchDocumentsData_1 = __decorate([
    customDataElement("hb-search-documents-data", {
        eventsListenAt: "parent"
    })
], SearchDocumentsData);
export { SearchDocumentsData };
const requestDocTypes = (state) => {
    state.docTypes = Object.keys(docTypes).map(key => docTypes[key]);
};
const addNewDocument = (repo, options) => async (stateChange) => {
    let docRef;
    try {
        docRef = await repo.addDoc(options);
    }
    catch (error) {
        if (error instanceof ClientError) {
            // FIXME: after stateChange CustomEvent -> Event
            stateChange.dispatchEvent(new CustomEvent("add-document-error", {
                bubbles: true,
                detail: error
            }));
        }
        else {
            throw error;
        }
        return;
    }
    // FIXME: after stateChange CustomEvent -> Event
    stateChange.dispatchEvent(new CustomEvent("document-added", {
        bubbles: true,
        detail: docRef
    }));
};
