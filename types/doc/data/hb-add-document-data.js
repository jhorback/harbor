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
import { ClientError } from "../../domain/Errors";
export class AddNewDocumentEvent extends Event {
    constructor(options) {
        super(AddNewDocumentEvent.eventType, { bubbles: true });
        this.options = options;
    }
}
AddNewDocumentEvent.eventType = "add-new-document";
export class DocumentAddedEvent extends Event {
    constructor(docModel) {
        super(DocumentAddedEvent.eventType, { bubbles: true });
        this.docModel = docModel;
    }
}
DocumentAddedEvent.eventType = "document-added";
export class AddDocumentErrorEvent extends Event {
    constructor(error) {
        super(AddDocumentErrorEvent.eventType, { bubbles: true });
        this.error = error;
    }
}
AddDocumentErrorEvent.eventType = "add-document-error";
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
        const options = event.options;
        StateChange.of(this)
            .tap(addNewDocument(this.addDocRepo, options));
    }
};
AddDocumentData.defaultState = { docTypes: [] };
__decorate([
    dataProperty()
], AddDocumentData.prototype, "state", void 0);
__decorate([
    inject(AddDocRepoKey)
], AddDocumentData.prototype, "addDocRepo", void 0);
__decorate([
    event(AddNewDocumentEvent.eventType)
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
    let docModel;
    try {
        docModel = await repo.addDoc(options);
    }
    catch (error) {
        if (error instanceof ClientError) {
            stateChange.dispatchEvent(new AddDocumentErrorEvent(error));
        }
        else {
            throw error;
        }
        return;
    }
    stateChange.dispatchEvent(new DocumentAddedEvent(docModel));
};
