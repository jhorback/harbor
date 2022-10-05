import { query, collection, where, getDocs, QueryDocumentSnapshot, orderBy, QueryConstraint } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { HbCurrentUser, UserAction } from "../HbCurrentUser";
import { DocModel } from "./DocModel";
import {
    ISearchDocsOptions,
    ISearchDocsRepo,
    SearchDocsRepoKey
} from "../interfaces/DocumentInterfaces";


@provides<ISearchDocsRepo>(SearchDocsRepoKey, !HbApp.isStorybook)
class SearchDocsRepo implements ISearchDocsRepo {

    async searchDocs(options: ISearchDocsOptions): Promise<DocModel[]> {
        const currentUser = new HbCurrentUser();
        const searchText = options.text?.toLowerCase();
        const queryArgs:Array<QueryConstraint> = [];

        
        // authorize which documents
        if (currentUser.authorize(UserAction.viewAllDocuments) === false) {
            queryArgs.push(where('authorUid', '==', currentUser.uid));
        }
       

        // order by last updated
        queryArgs.push(orderBy("dateUpdated", "desc"));


        // query
        const q = query.call(query, collection(HbDb.current, "documents"), ...queryArgs)
            .withConverter(DocModel);
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc:QueryDocumentSnapshot<DocModel>) => doc.data());


        // apply search text on client
        if (searchText === "") {
            return [];
        } else if (searchText !== undefined) {            
            const filter = docs.filter(d => d.title.toLowerCase().indexOf(searchText) >= 0);
            return filter;
        } else {
            return docs;
        }
    }
}