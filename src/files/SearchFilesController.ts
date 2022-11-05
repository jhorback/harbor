import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../domain/DependencyContainer/decorators";
import { FileModel } from "../domain/Files/FileModel";
import { ISearchFilesOptions, ISearchFilesRepo, SearchFilesRepoKey } from "../domain/interfaces/FileInterfaces";


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

export class SearchFilesController extends StateController {

    @stateProperty()
    state:ISearchFilesState = {
        list: [],
        isLoading: false,
        count: 0
    };

    @inject<ISearchFilesRepo>(SearchFilesRepoKey)
    private searchDocsRepo!:ISearchFilesRepo;

    @hostEvent(SearchFilesEvent)
    searchFiles(event:SearchFilesEvent) {
        const options = event.options;
        Product.of<ISearchFilesState>(this, "state")
            .next(setIsLoading(true))
            .tap(searchDocuments(this.searchDocsRepo, options))
            .requestUpdate(event);
    }
}


const searchDocuments = (repo:ISearchFilesRepo, options:ISearchFilesOptions) =>
    async (product:Product<ISearchFilesState>) => {
        const files = await repo.searchFiles(options);
        product
            .next(updateFilesList(files))
            .next(setIsLoading(false))
            .requestUpdate("searchDocuments");
    };

const updateFilesList = (files:Array<FileModel>) => (state:ISearchFilesState) => {
    state.list = files;
    state.count = files.length;
};

const setIsLoading = (isLoading:boolean) => (state:ISearchFilesState) => {
    state.isLoading = isLoading;
};