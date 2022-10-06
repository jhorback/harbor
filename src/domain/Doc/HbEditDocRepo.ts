import { doc, FirestoreError, onSnapshot, setDoc } from "firebase/firestore";
import { ClientError, ServerError } from "../Errors";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { DocModel } from "./DocModel";
import { FindDocRepo } from "../Doc/FindDocRepo";
import {
    EditDocRepoKey,
    IEditDocRepo,
    IUnsubscribe
} from "../interfaces/DocumentInterfaces";
import { authorize, UserAction, HbCurrentUser } from "../HbCurrentUser";
import { NotFoundError } from "../Errors";



@provides<IEditDocRepo>(EditDocRepoKey, !HbApp.isStorybook)
class EditDocRepo implements IEditDocRepo {
    private findDocRepo:FindDocRepo;
    private currentUser:HbCurrentUser;

    constructor() {
        this.findDocRepo = new FindDocRepo();
        this.currentUser = new HbCurrentUser();
    }
    
    private getCurrentUserId():string {
        const authorId = this.currentUser.uid;
        if (!authorId) {
            throw new Error("The current user is not logged in.");
        }
        return authorId;
    }

    subscribeToDoc(uid:string, callback:(doc: DocModel) => void):IUnsubscribe {
        return onSnapshot(doc(HbDb.current, "documents", uid).withConverter(DocModel), (snapshot) => {
            if (snapshot.exists() === false) {
                throw new NotFoundError("Document not found");
            }
            callback(snapshot.data() as DocModel);
        }, (error:FirestoreError) => {
            throw new ServerError(error.message, error);
        });
    }
}