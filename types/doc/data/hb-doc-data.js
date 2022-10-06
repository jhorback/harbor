var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DocData_1;
import { DataElement } from "@domx/dataelement";
import { customDataElement, dataProperty } from "@domx/dataelement/decorators";
let DocData = DocData_1 = class DocData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = DocData_1.defaultState;
        // @inject<ISearchDocsRepo>(SearchDocsRepoKey)
        // private searchDocsRepo!:ISearchDocsRepo;
        // @event(SearchDocsEvent.eventType)
        // addNewDocument(event:SearchDocsEvent) {
        //     const options = event.options;
        //     StateChange.of(this)
        //         .next(setIsLoading(true))
        //         .tap(searchDocuments(this.searchDocsRepo, options))
        //         .dispatch();
        // }
    }
};
DocData.defaultState = {};
__decorate([
    dataProperty()
], DocData.prototype, "state", void 0);
DocData = DocData_1 = __decorate([
    customDataElement("hb-doc-data", {
        eventsListenAt: "parent"
    })
], DocData);
export { DocData };
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
