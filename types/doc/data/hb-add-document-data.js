var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AddDocumentData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { AddDocRepoKey } from "../../domain/interfaces/DocumentInterfaces";
import { docTypes } from "../../domain/Doc/docTypes";
import "../../domain/Doc/HbAddDocRepo";
import { ClientError } from "../../domain/ClientError";
let AddDocumentData = AddDocumentData_1 = class AddDocumentData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = AddDocumentData_1.defaultState;
    }
    connectedCallback() {
        super.connectedCallback();
        StateChange.of(this)
            .next(requestDocTypes)
            .dispatch();
    }
    addNewDocument(event) {
        const options = event.detail;
        StateChange.of(this)
            .tap(addNewDocument(this.addDocRepo, options));
    }
};
AddDocumentData.defaultState = { docTypes: [] };
AddDocumentData.addNewDocumentEvent = (detail) => new CustomEvent("add-new-document", {
    bubbles: true,
    detail
});
__decorate([
    dataProperty()
], AddDocumentData.prototype, "state", void 0);
__decorate([
    inject(AddDocRepoKey)
], AddDocumentData.prototype, "addDocRepo", void 0);
__decorate([
    event("add-new-document")
], AddDocumentData.prototype, "addNewDocument", null);
AddDocumentData = AddDocumentData_1 = __decorate([
    customDataElement("hb-add-document-data", {
        eventsListenAt: "parent"
    })
], AddDocumentData);
export { AddDocumentData };
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
    stateChange.dispatchEvent(new CustomEvent("document-added", {
        bubbles: true,
        detail: docRef
    }));
};
