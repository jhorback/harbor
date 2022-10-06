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

    private documentSubscribe() {
        this.documentUnsubscribe = this.editDocRepo.subscribeToDoc(this.uid, (doc) => {
            StateChange.of(this)
                .next(updateDoc(doc))
                .dispatch();
        });
    }

    connectedCallback(): void {
        super.connectedCallback();
        this.documentSubscribe();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.documentUnsubscribe && this.documentSubscribe();
    }
}


const updateDoc = (doc:DocModel) => (state:IDocDataState) => {
    state.doc = doc;
};


// const searchDocuments = (repo:ISearchDocsRepo, options:ISearchDocsOptions) => async (stateChange:StateChange) => {
//     const docs = await repo.searchDocs(options);
//     stateChange
//         .next(updateDocsList(docs))
//         .next(setIsLoading(false))
//         .dispatch();
// };

// const updateDocsList = (docs:Array<DocModel>) => (state:ISearchDocsState) => {
//     state.list = docs;
//     state.count = docs.length;
// };

// const setIsLoading = (isLoading:boolean) => (state:ISearchDocsState) => {
//     state.isLoading = isLoading;
// };