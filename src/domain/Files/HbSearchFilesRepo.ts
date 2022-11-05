import { query, collection, where, getDocs, QueryDocumentSnapshot, orderBy, QueryConstraint, collectionGroup } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { HbCurrentUser, UserAction } from "../HbCurrentUser";
import {
    FileType,
    IFileData,
    ISearchFilesOptions,
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
            queryArgs.push(where('ownerUid', '==', currentUser.uid));
        }

        if (options.type !== undefined && options.type !== FileType.files) {
            queryArgs.push(where("type", ">=", options.type));
        } else {
            // order by last updated
            queryArgs.push(orderBy("updated", "desc"));
        }

        
        


        // query
        const q = query.call(query, collectionGroup(HbDb.current, "files"), ...queryArgs)
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