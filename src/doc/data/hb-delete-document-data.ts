import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { IDeleteDocRepo, DeleteDocRepoKey } from "../../domain/interfaces/DocumentInterfaces";
import "../../domain/Doc/HbDeleteDocRepo";
import { ServerError } from "../../domain/Errors";


export class DeleteDocumentEvent extends Event {
    static eventType = "delete-document";
    uid:string;
    constructor(uid:string) {
        super(DeleteDocumentEvent.eventType, {bubbles: true});
        this.uid = uid;
    }
}

export class DocumentDeletedEvent extends Event {
    static eventType = "document-deleted";
    constructor() {
        super(DocumentDeletedEvent.eventType, {bubbles: true});
    }
}


@customDataElement("hb-delete-document-data", {
    eventsListenAt: "parent"
})
export class DeleteDocumentData extends DataElement {
    @inject<IDeleteDocRepo>(DeleteDocRepoKey)
    private deleteDocRepo!:IDeleteDocRepo;

    @event(DeleteDocumentEvent.eventType)
    async deleteDocument(event:DeleteDocumentEvent) {
        StateChange.of(this)
            .tap(deleteDocument(this.deleteDocRepo, event.uid));
    }
}


const deleteDocument = (repo:IDeleteDocRepo, uid:string) => async (stateChange:StateChange) => {
    try {

        await repo.deleteDoc(uid);
        stateChange.dispatchEvent(new DocumentDeletedEvent());

    } catch(error:any) {
        // need to manually dispatch this error on the window
        // since we are in a dialog element
        window.dispatchEvent(new ErrorEvent("error", {
            error: new ServerError("Delete document error", error)
        }));
    }
};