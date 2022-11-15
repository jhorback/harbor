import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../domain/DependencyContainer/decorators";
import { IPageSearchOptions, ISearchPagesRepo, SearchPagesRepoKey } from "../domain/interfaces/PageInterfaces";
import "../domain/Pages/HbSearchPagesRepo";
import { PageModel } from "../domain/Pages/PageModel";



export interface IPageSearchState {
    list: Array<PageModel>;
    isLoading:boolean;
    count: number;
}


export class SearchPagesEvent extends Event {
    static eventType = "search-pages";
    options:IPageSearchOptions;
    constructor(options:IPageSearchOptions) {
        super(SearchPagesEvent.eventType, {bubbles:true});
        this.options = options;
    }
}


export class PageSearchController extends StateController {
    
    @stateProperty()
    state:IPageSearchState = {
        list: [],
        isLoading: false,
        count: 0
    };

    @inject<ISearchPagesRepo>(SearchPagesRepoKey)
    private searchPagesRepo!:ISearchPagesRepo;


    @hostEvent(SearchPagesEvent)
    searchDocs(event:SearchPagesEvent) {
        const options = event.options;
        Product.of<IPageSearchState>(this)
            .next(setIsLoading(true))
            .tap(searchPages(this.searchPagesRepo, options))
            .requestUpdate(event);
    }
}


const searchPages = (repo:ISearchPagesRepo, options:IPageSearchOptions) =>
    async (product:Product<IPageSearchState>) => {
    const pages = await repo.searchPages(options);
    product
        .next(updatePagesList(pages))
        .next(setIsLoading(false))
        .requestUpdate("PageSearchController.searchPages");
};

const updatePagesList = (pages:Array<PageModel>) => (state:IPageSearchState) => {
    state.list = pages;
    state.count = pages.length;
};

const setIsLoading = (isLoading:boolean) => (state:IPageSearchState) => {
    state.isLoading = isLoading;
};