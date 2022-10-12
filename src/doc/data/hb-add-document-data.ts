import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { IDocTypeDescriptor, IAddDocRepo, AddDocRepoKey, IAddNewDocumentOptions, IDocumentReference } from "../../domain/interfaces/DocumentInterfaces";
import { docTypes } from "../../domain/Doc/docTypes";
import "../../domain/Doc/HbAddDocRepo";
import { ClientError } from "../../domain/Errors";
import { DocModel } from "../../domain/Doc/DocModel";



export interface IAddDocumentState {
    docTypes: Array<IDocTypeDescriptor>;
}


export class AddNewDocumentEvent extends Event {
    static eventType = "add-new-document";
    options:IAddNewDocumentOptions;
    constructor(options:IAddNewDocumentOptions) {
        super(AddNewDocumentEvent.eventType, { bubbles: true });
        this.options = options;
    }
}

export class DocumentAddedEvent extends Event {
    static eventType = "document-added";
    docModel:DocModel;
    constructor(docModel:DocModel) {
        super(DocumentAddedEvent.eventType, {bubbles: true});
        this.docModel = docModel;
    }
}

export class AddDocumentErrorEvent extends Event {
    static eventType = "add-document-error";
    error:ClientError;
    constructor(error:ClientError) {
        super(AddDocumentErrorEvent.eventType, {bubbles: true});
        this.error = error;
    }
}


@customDataElement("hb-add-document-data", {
    eventsListenAt: "parent"
})
export class AddDocumentData extends DataElement {
    static defaultState:IAddDocumentState = {docTypes:[]};
    
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

    @event(AddNewDocumentEvent.eventType)
    addNewDocument(event:AddNewDocumentEvent) {
        const options = event.options;
        StateChange.of(this)
            .tap(addNewDocument(this.addDocRepo, options));
    }
}



const requestDocTypes = (state:IAddDocumentState) => {
    state.docTypes = Object.keys(docTypes).map(key => docTypes[key]);
};


const addNewDocument = (repo:IAddDocRepo, options:IAddNewDocumentOptions) => async (stateChange:StateChange) => {

    let docModel:DocModel;

    try {
        docModel = await repo.addDoc(options);
    }
    catch(error:any) {
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