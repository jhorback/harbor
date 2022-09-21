import { getDocs, collection, QueryDocumentSnapshot, doc, updateDoc } from "firebase/firestore";
import { ClientError } from "../ClientError";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { AddDocRepoKey, IAddDocRepo, IAddNewDocumentOptions, IDocumentReference } from "../interfaces/DocumentInterfaces";
import { DocModel } from "./DocModel";





@provides<IAddDocRepo>(AddDocRepoKey, !HbApp.isStorybook)
class AddDocRepo implements IAddDocRepo {

    async addDoc(options:IAddNewDocumentOptions): Promise<IDocumentReference> {

        const clientError = new ClientError("The document already exists");
        clientError.addPropertyError("title", "The document already exists");
        throw clientError;

        //const query = await getDocs(collection(HbDb.current, "users"));
        const docRef:IDocumentReference = {
            uid: "TEST",
            docType: "TEST",
            pid: "TEST",
            documentRef: "TEST"
        }
        return docRef;
    }
}