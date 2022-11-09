import { collection, getDocs, orderBy, query, QueryConstraint, QueryDocumentSnapshot, where } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbCurrentUser, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import {
    FileType, ISearchFilesOptions,
    ISearchFilesRepo,
    SearchFilesRepoKey
} from "../interfaces/FileInterfaces";
import { FileModel } from "./FileModel";


@provides<ISearchFilesRepo>(SearchFilesRepoKey, !HbApp.isStorybook)
class SearchFilesRepo implements ISearchFilesRepo {
    async searchFiles(options: ISearchFilesOptions): Promise<FileModel[]> {
        const currentUser = new HbCurrentUser();
        const searchText = options.text?.toLowerCase();
        const queryArgs:Array<QueryConstraint> = [];

        
        // authorize which documents
        if (currentUser.authorize(UserAction.viewAllFiles) === false) {
            queryArgs.push(where('uploaderUid', '==', currentUser.uid));
        }

        if (options.type !== undefined && options.type !== FileType.file) {
            queryArgs.push(where("type", ">=", options.type));
            queryArgs.push(where("type", "<=", options.type+"~"));
        } else {
            // order by last updated
            queryArgs.push(orderBy("updated", "desc"));
        }


        // query
        const q = query.call(query, collection(HbDb.current, "files"), ...queryArgs)
            .withConverter(FileModel);
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc:QueryDocumentSnapshot<FileModel>) => doc.data());


        // apply search text on client
        if (searchText === "") {
            return [];
        } else if (searchText !== undefined) {            
            const filter = docs.filter(d => d.name.toLowerCase().indexOf(searchText) >= 0);
            return filter;
        } else {
            return docs;
        }
    }
}