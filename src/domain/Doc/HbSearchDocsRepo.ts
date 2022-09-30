import { query, collection, where, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { DocModel } from "./DocModel";
import {
    ISearchDocsOptions,
    ISearchDocsRepo,
    SearchDocsRepoKey
} from "../interfaces/DocumentInterfaces";


@provides<ISearchDocsRepo>(SearchDocsRepoKey, !HbApp.isStorybook)
class SearchDocsRepo implements ISearchDocsRepo {

    async searchDocs(options: ISearchDocsOptions): Promise<DocModel[]> {
        const searchText = options.text?.toUpperCase();
        const q = query(collection(HbDb.current, "documents"),
                //where('titleUppercase', '>=', searchText),
                where('title', '>=', searchText + 'z'),
                //where("titleUppercase", ">=", searchText)
            )
            .withConverter(DocModel);
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc:QueryDocumentSnapshot<DocModel>) => doc.data());
        return docs;
    }
}