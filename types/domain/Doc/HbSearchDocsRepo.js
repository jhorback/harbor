var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { query, collection, where, getDocs, orderBy } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { HbCurrentUser, UserAction } from "../HbCurrentUser";
import { DocModel } from "./DocModel";
import { SearchDocsRepoKey } from "../interfaces/DocumentInterfaces";
let SearchDocsRepo = class SearchDocsRepo {
    async searchDocs(options) {
        const currentUser = new HbCurrentUser();
        const searchText = options.text?.toLowerCase();
        const queryArgs = [];
        // authorize which documents
        if (currentUser.authorize(UserAction.viewAllDocuments) === false) {
            queryArgs.push(where('authorUid', '==', currentUser.uid));
        }
        // order by last updated
        queryArgs.push(orderBy("dateUpdated", "desc"));
        // query
        const q = query.call(query, collection(HbDb.current, "documents"), ...queryArgs)
            .withConverter(DocModel);
        const snapshot = await getDocs(q);
        const docs = snapshot.docs.map((doc) => doc.data());
        // apply search text on client
        if (searchText === "") {
            return [];
        }
        else if (searchText !== undefined) {
            const filter = docs.filter(d => d.title.toLowerCase().indexOf(searchText) >= 0);
            return filter;
        }
        else {
            return docs;
        }
    }
};
SearchDocsRepo = __decorate([
    provides(SearchDocsRepoKey, !HbApp.isStorybook)
], SearchDocsRepo);
