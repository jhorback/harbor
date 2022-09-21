import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { IDocTypeDescriptor, IAddDocRepo, AddDocRepoKey, IAddNewDocumentOptions, IDocumentReference } from "../../domain/interfaces/DocumentInterfaces";
import { docTypes } from "../../domain/Doc/docTypes";
import "../../domain/Doc/HbAddDocRepo";
import { ClientError } from "../../domain/ClientError";



export interface IAddDocumentState {
    docTypes: Array<IDocTypeDescriptor>;
}




@customDataElement("hb-add-document-data", {
    eventsListenAt: "parent"
})
export class AddDocumentData extends DataElement {
    static defaultState:IAddDocumentState = {docTypes:[]};

    static addNewDocumentEvent = (detail:IAddNewDocumentOptions) => new CustomEvent("add-new-document", {
        bubbles: true,
        detail
    })
    
    @dataProperty()
    state:IAddDocumentState = AddDocumentData.defaultState;

    @inject<IAddDocRepo>(AddDocRepoKey)
    private addDocRepo!:IAddDocRepo;

    connectedCallback() {
        super.connectedCallback();
        StateChange.of(this)
            .next(requestDocTypes)
            .dispatch();
    }

    @event("add-new-document")
    addNewDocument(event:CustomEvent) {
        const options = event.detail as IAddNewDocumentOptions;
        StateChange.of(this)
            .tap(addNewDocument(this.addDocRepo, options));
    }
}



const requestDocTypes = (state:IAddDocumentState) => {
    state.docTypes = Object.keys(docTypes).map(key => docTypes[key]);
};


const addNewDocument = (repo:IAddDocRepo, options:IAddNewDocumentOptions) => async (stateChange:StateChange) => {

    let docRef:IDocumentReference;

    try {
        docRef = await repo.addDoc(options);
    }
    catch(error:any) {
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