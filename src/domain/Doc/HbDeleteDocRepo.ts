import { deleteDoc, doc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import {
    DeleteDocRepoKey,
    IDeleteDocRepo
} from "../interfaces/DocumentInterfaces";
import { authorize, UserAction } from "../HbCurrentUser";


@provides<IDeleteDocRepo>(DeleteDocRepoKey, !HbApp.isStorybook)
class DeleteDocRepo implements IDeleteDocRepo {

    @authorize(UserAction.authorDocuments)
    async deleteDoc(uid: string): Promise<void> {
        await deleteDoc(doc(HbDb.current, "documents", uid));
    }
}