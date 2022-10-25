import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { ISearchFilesRepo, SearchFilesRepoKey, ISearchFilesOptions } from "../../domain/interfaces/FileInterfaces";
import "../../domain/Files/HbSearchFilesRepo";
import { FileModel } from "../../domain/Files/FileModel";



export interface ISearchFilesState {
    list: Array<FileModel>;
    isLoading:boolean;
    count: number;
}


export class SearchFilesEvent extends Event {
    static eventType = "search-files";
    options:ISearchFilesOptions;
    constructor(options:ISearchFilesOptions) {
        super(SearchFilesEvent.eventType, {bubbles:true});
        this.options = options;
    }
}



@customDataElement("hb-search-files-data", {
    eventsListenAt: "parent"
})
export class SearchFilesData extends DataElement {
    static defaultState:ISearchFilesState = {
        list: [],
        isLoading: false,
        count: 0
    };
    
    @dataProperty()
    state:ISearchFilesState = SearchFilesData.defaultState;

    @inject<ISearchFilesRepo>(SearchFilesRepoKey)
    private searchDocsRepo!:ISearchFilesRepo;


    @event(SearchFilesEvent.eventType)
    searchFiles(event:SearchFilesEvent) {
        const options = event.options;
        StateChange.of(this)
            .next(setIsLoading(true))
            .tap(searchDocuments(this.searchDocsRepo, options))
            .dispatch();
    }
}


const searchDocuments = (repo:ISearchFilesRepo, options:ISearchFilesOptions) => async (stateChange:StateChange) => {
    const files = await repo.searchFiles(options);
    stateChange
        .next(updateFilesList(files))
        .next(setIsLoading(false))
        .dispatch();
};

const updateFilesList = (files:Array<FileModel>) => (state:ISearchFilesState) => {
    state.list = files;
    state.count = files.length;
};

const setIsLoading = (isLoading:boolean) => (state:ISearchFilesState) => {
    state.isLoading = isLoading;
};