var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, setDoc } from "firebase/firestore";
import { ClientError } from "../ClientError";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { DocModel } from "./DocModel";
import { FindDocRepo } from "../Doc/FindDocRepo";
import { AddDocRepoKey } from "../interfaces/DocumentInterfaces";
let AddDocRepo = class AddDocRepo {
    constructor() {
        this.findDocRepo = new FindDocRepo();
    }
    async addDoc(options) {
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
    async addNewDoc(newDoc) {
        const ref = doc(HbDb.current, "documents", newDoc.uid).withConverter(DocModel);
        await setDoc(ref, newDoc);
    }
};
AddDocRepo = __decorate([
    provides(AddDocRepoKey, !HbApp.isStorybook)
], AddDocRepo);
