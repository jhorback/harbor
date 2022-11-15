import { collection, getDocs, orderBy, query, QueryConstraint, QueryDocumentSnapshot, where } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbCurrentUser, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import {
    ISearchPagesOptions,
    ISearchPagesRepo,
    SearchPagesRepoKey
} from "../interfaces/PageInterfaces";
import { PageModel } from "./PageModel";


@provides<ISearchPagesRepo>(SearchPagesRepoKey, !HbApp.isStorybook)
class SearchPagesRepo implements ISearchPagesRepo {

    async searchPages(options: ISearchPagesOptions): Promise<PageModel[]> {
        const currentUser = new HbCurrentUser();
        const searchText = options.text?.toLowerCase();
        const queryArgs:Array<QueryConstraint> = [];

        
        // authorize which pages
        if (currentUser.authorize(UserAction.viewAllDocuments) === false) {
            queryArgs.push(where('authorUid', '==', currentUser.uid));
        }
       

        // order by last updated
        queryArgs.push(orderBy("dateUpdated", "desc"));


        // query
        const q = query.call(query, collection(HbDb.current, "pages"), ...queryArgs)
            .withConverter(PageModel);
        const snapshot = await getDocs(q);
        const pages = snapshot.docs.map((page:QueryDocumentSnapshot<PageModel>) => page.data());


        // apply search text on client
        if (searchText === "") {
            return [];
        } else if (searchText !== undefined) {            
            const filter = pages.filter(d => d.title.toLowerCase().indexOf(searchText) >= 0);
            return filter;
        } else {
            return pages;
        }
    }
}