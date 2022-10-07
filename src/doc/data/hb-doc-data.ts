import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { DocModel } from "../../domain/Doc/DocModel";
import { EditDocRepoKey, IDocData, IEditDocRepo, IUnsubscribe } from "../../domain/interfaces/DocumentInterfaces";
import "../../domain/Doc/HbEditDocRepo";


export interface IDocDataState {
    isLoaded: boolean;
    currentUserCanEdit: boolean;
    doc:IDocData;
}



@customDataElement("hb-doc-data", {
    eventsListenAt: "parent",
    stateIdProperty: "uid"
})
export class DocData extends DataElement {
    static defaultState:IDocDataState = {
        isLoaded: false,
        currentUserCanEdit: false,
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
}


const subscribeToDoc = (docData:DocData) => (doc:DocModel) => {
    StateChange.of(docData)
        .next(updateDoc(doc))
        .dispatch();
};

const updateDoc = (doc:DocModel) => (state:IDocDataState) => {
    state.doc = doc;
};