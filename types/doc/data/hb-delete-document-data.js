var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { DeleteDocRepoKey } from "../../domain/interfaces/DocumentInterfaces";
import "../../domain/Doc/HbDeleteDocRepo";
import { ServerError } from "../../domain/Errors";
export class DeleteDocumentEvent extends Event {
    constructor(uid) {
        super(DeleteDocumentEvent.eventType, { bubbles: true });
        this.uid = uid;
    }
}
DeleteDocumentEvent.eventType = "delete-document";
export class DocumentDeletedEvent extends Event {
    constructor() {
        super(DocumentDeletedEvent.eventType, { bubbles: true });
    }
}
DocumentDeletedEvent.eventType = "document-deleted";
let DeleteDocumentData = class DeleteDocumentData extends DataElement {
    async deleteDocument(event) {
        StateChange.of(this)
            .tap(deleteDocument(this.deleteDocRepo, event.uid));
    }
};
__decorate([
    inject(DeleteDocRepoKey)
], DeleteDocumentData.prototype, "deleteDocRepo", void 0);
__decorate([
    event(DeleteDocumentEvent.eventType)
], DeleteDocumentData.prototype, "deleteDocument", null);
DeleteDocumentData = __decorate([
    customDataElement("hb-delete-document-data", {
        eventsListenAt: "parent"
    })
], DeleteDocumentData);
export { DeleteDocumentData };
const deleteDocument = (repo, uid) => async (stateChange) => {
    try {
        await repo.deleteDoc(uid);
        stateChange.dispatchEvent(new DocumentDeletedEvent());
    }
    catch (error) {
        // need to manually dispatch this error on the window
        // since we are in a dialog element
        window.dispatchEvent(new ErrorEvent("error", {
            error: new ServerError("Delete document error", error)
        }));
    }
};
