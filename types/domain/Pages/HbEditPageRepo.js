var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { NotFoundError, ServerError } from "../Errors";
import { HbApp } from "../HbApp";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { EditPageRepoKey } from "../interfaces/PageInterfaces";
import { FindPageRepo } from "../Pages/FindPageRepo";
import { PageModel } from "./PageModel";
let EditPageRepo = class EditPageRepo {
    constructor() {
        this.findPageRepo = new FindPageRepo();
        this.currentUser = new HbCurrentUser();
    }
    getCurrentUserId() {
        const authorId = this.currentUser.uid;
        if (!authorId) {
            throw new Error("The current user is not logged in.");
        }
        return authorId;
    }
    async subscribeToPage(pathname, callback, signal) {
        const page = await this.findPageRepo.findPageByPathname(pathname);
        if (page === null) {
            throw new NotFoundError(`Page not found: ${pathname}`);
        }
        const unsubscribe = onSnapshot(doc(HbDb.current, "pages", page.uid)
            .withConverter(PageModel), (snapshot) => {
            const doc = snapshot.data();
            callback(doc);
        }, (error) => {
            throw new ServerError(error.message, error);
        });
        signal.addEventListener("abort", unsubscribe);
    }
    async savePage(page) {
        try {
            await setDoc(doc(HbDb.current, "documents", page.uid)
                .withConverter(PageModel), page);
        }
        catch (error) {
            throw new ServerError(error.message, error);
        }
    }
};
EditPageRepo = __decorate([
    provides(EditPageRepoKey, !HbApp.isStorybook)
], EditPageRepo);
