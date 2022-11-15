var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbCurrentUser, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { SearchPagesRepoKey } from "../interfaces/PageInterfaces";
import { PageModel } from "./PageModel";
let SearchPagesRepo = class SearchPagesRepo {
    async searchPages(options) {
        const currentUser = new HbCurrentUser();
        const searchText = options.text?.toLowerCase();
        const queryArgs = [];
        // authorize which pages
        if (currentUser.authorize(UserAction.viewAllDocuments) === false) {
            queryArgs.push(where('authorUid', '==', currentUser.uid));
        }
        // order by last updated
        queryArgs.push(orderBy("dateUpdated", "desc"));
        // query
        const q = query.call(query, collection(HbDb.current, "pages"), ...queryArgs)
            .withConverter(PageModel);
        const snapshot = await getDocs(q);
        const pages = snapshot.docs.map((page) => page.data());
        // apply search text on client
        if (searchText === "") {
            return [];
        }
        else if (searchText !== undefined) {
            const filter = pages.filter(d => d.title.toLowerCase().indexOf(searchText) >= 0);
            return filter;
        }
        else {
            return pages;
        }
    }
};
SearchPagesRepo = __decorate([
    provides(SearchPagesRepoKey, !HbApp.isStorybook)
], SearchPagesRepo);
