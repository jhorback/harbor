import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { DocModel } from "../../domain/Doc/DocModel";
import { EditDocRepoKey, IDocData, IEditDocRepo, IUnsubscribe } from "../../domain/interfaces/DocumentInterfaces";
import { UserAction, HbCurrentUser } from "../../domain/HbCurrentUser";
import "../../domain/Doc/HbEditDocRepo";
import { HbCurrentUserChangedEvent } from "../../domain/HbAuth";


export interface IDocDataState {
    isLoaded: boolean;
    currentUserCanEdit: boolean;
    currentUserCanAdd: boolean;
    doc:DocModel;
}



@customDataElement("hb-doc-data", {
    eventsListenAt: "parent",
    stateIdProperty: "uid"
})
export class DocData extends DataElement {
    static defaultState:IDocDataState = {
        isLoaded: false,
        currentUserCanEdit: false,
        currentUserCanAdd: false,
        doc: new DocModel()
    };

    get uid():string { return this.getAttribute("uid") || ""; }
    set uid(uid:string) { this.setAttribute("uid", uid); }

    
    @dataProperty()
    state:IDocDataState = DocData.defaultState;

    @inject<IEditDocRepo>(EditDocRepoKey)
    private editDocRepo!:IEditDocRepo;

    private documentUnsubscribe:IUnsubscribe|null = null;

    connectedCallback(): void {
        super.connectedCallback();
        this.documentSubscribe();
    }

    private documentSubscribe() {
        this.documentUnsubscribe = this.editDocRepo.subscribeToDoc(this.uid,
            subscribeToDoc(this));
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.documentUnsubscribe && this.documentUnsubscribe();
    }

    @event(HbCurrentUserChangedEvent.eventType, {
        listenAt: "window",
        stopImmediatePropagation: false
    })
    private currentUserChanged(event:HbCurrentUserChangedEvent) {
        StateChange.of(this)
            .next(updateUserCanEdit(this.state.doc))
            .next(updateUserCanAdd)
            .dispatch();
    }
}


const subscribeToDoc = (docData:DocData) => (doc:DocModel) => {
    StateChange.of(docData)
        .next(updateDoc(doc))
        .next(updateUserCanEdit(doc))
        .next(updateUserCanAdd)
        .dispatch();
};

const updateDoc = (doc:DocModel) => (state:IDocDataState) => {
    state.isLoaded = true;
    state.doc = doc;
};

const updateUserCanEdit = (doc:DocModel) => (state:IDocDataState) => {
    state.currentUserCanEdit = userCanEdit(doc);
};

const updateUserCanAdd = (state:IDocDataState) => {
    state.currentUserCanAdd = new HbCurrentUser().authorize(UserAction.authorDocuments);
}

const userCanEdit = (doc:DocModel):boolean => {
    const currentUser = new HbCurrentUser();
    return currentUser.uid === doc.authorUid
        || currentUser.authorize(UserAction.editAnyDocument);
}