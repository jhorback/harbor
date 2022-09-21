import { doc, setDoc } from "firebase/firestore";
import { ClientError } from "../ClientError";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { DocModel } from "./DocModel";
import { FindDocRepo } from "../Doc/FindDocRepo";
import {
    AddDocRepoKey,
    IAddDocRepo,
    IAddNewDocumentOptions,
    IDocumentReference
} from "../interfaces/DocumentInterfaces";


@provides<IAddDocRepo>(AddDocRepoKey, !HbApp.isStorybook)
class AddDocRepo implements IAddDocRepo {
    private findDocRepo:FindDocRepo;

    constructor() {
        this.findDocRepo = new FindDocRepo();
    }

    async addDoc(options:IAddNewDocumentOptions): Promise<IDocumentReference> {

        var newDoc = DocModel.createNewDoc(options);
        
        const existingDoc = this.findDocRepo.findDoc(newDoc.uid);
        if (existingDoc !== null) {
            const clientError = new ClientError("The document already exists");
            clientError.addPropertyError("title", "The document already exists");
            throw clientError;
        }
        await this.addNewDoc(newDoc);
        return newDoc.toDocumentReference();
    }

    private async addNewDoc(newDoc:DocModel) {
        const ref = doc(HbDb.current, "documents", newDoc.uid).withConverter(DocModel);
        await setDoc(ref, newDoc);
    }
}