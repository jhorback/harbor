import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { ISearchDocsRepo, SearchDocsRepoKey, ISearchDocsOptions } from "../../domain/interfaces/DocumentInterfaces";
import "../../domain/Doc/HbSearchDocsRepo";
import { DocModel } from "../../domain/Doc/DocModel";



export interface ISearchDocsState {
    list: Array<DocModel>;
    isLoading:boolean;
    count: number;
}


export class SearchDocsEvent extends Event {
    static eventType = "search-docs";
    options:ISearchDocsOptions;
    constructor(options:ISearchDocsOptions) {
        super(SearchDocsEvent.eventType, {bubbles:true});
        this.options = options;
    }
}



@customDataElement("hb-search-docs-data", {
    eventsListenAt: "parent"
})
export class SearchDocsData extends DataElement {
    static defaultState:ISearchDocsState = {
        list: [],
        isLoading: false,
        count: 0
    };
    
    @dataProperty()
    state:ISearchDocsState = SearchDocsData.defaultState;

    @inject<ISearchDocsRepo>(SearchDocsRepoKey)
    private searchDocsRepo!:ISearchDocsRepo;


    @event(SearchDocsEvent.eventType)
    addNewDocument(event:SearchDocsEvent) {
        const options = event.options;
        StateChange.of(this)
            .next(setIsLoading(true))
            .tap(searchDocuments(this.searchDocsRepo, options))
            .dispatch();
    }
}


const searchDocuments = (repo:ISearchDocsRepo, options:ISearchDocsOptions) => async (stateChange:StateChange) => {
    const docs = await repo.searchDocs(options);
    stateChange
        .next(updateDocsList(docs))
        .next(setIsLoading(false))
        .dispatch();
};

const updateDocsList = (docs:Array<DocModel>) => (state:ISearchDocsState) => {
    state.list = docs;
    state.count = docs.length;
};

const setIsLoading = (isLoading:boolean) => (state:ISearchDocsState) => {
    state.isLoading = isLoading;
};