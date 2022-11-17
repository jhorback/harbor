import { deleteDoc, doc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import {
    DeletePageRepoKey,
    IDeletePageRepo
} from "../interfaces/PageInterfaces";
import { authorize, UserAction } from "../HbCurrentUser";


@provides<IDeletePageRepo>(DeletePageRepoKey, !HbApp.isStorybook)
class DeletePageRepo implements IDeletePageRepo {

    @authorize(UserAction.authorPages)
    async deletePage(uid: string): Promise<void> {
        await deleteDoc(doc(HbDb.current, "pages", uid));
    }
}