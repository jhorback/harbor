var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, onSnapshot } from "firebase/firestore";
import { ServerError } from "../Errors";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { DocModel } from "./DocModel";
import { FindDocRepo } from "../Doc/FindDocRepo";
import { EditDocRepoKey } from "../interfaces/DocumentInterfaces";
import { HbCurrentUser } from "../HbCurrentUser";
import { NotFoundError } from "../Errors";
let EditDocRepo = class EditDocRepo {
    constructor() {
        this.findDocRepo = new FindDocRepo();
        this.currentUser = new HbCurrentUser();
    }
    getCurrentUserId() {
        const authorId = this.currentUser.uid;
        if (!authorId) {
            throw new Error("The current user is not logged in.");
        }
        return authorId;
    }
    subscribeToDoc(uid, callback) {
        return onSnapshot(doc(HbDb.current, "documents", uid).withConverter(DocModel), (snapshot) => {
            if (snapshot.exists() === false) {
                throw new NotFoundError("Document not found");
            }
            callback(snapshot.data());
        }, (error) => {
            throw new ServerError(error.message, error);
        });
    }
};
EditDocRepo = __decorate([
    provides(EditDocRepoKey, !HbApp.isStorybook)
], EditDocRepo);
