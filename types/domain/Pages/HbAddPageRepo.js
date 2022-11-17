var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { collection, doc, setDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { ClientError } from "../Errors";
import { HbApp } from "../HbApp";
import { authorize, HbCurrentUser, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { AddPageRepoKey } from "../interfaces/PageInterfaces";
import { FindPageRepo } from "./FindPageRepo";
KeyboardEvent;
import { PageModel } from "./PageModel";
let AddPageRepo = class AddPageRepo {
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
    async pageExists(pathname) {
        // reserved routes
        if (pathname.indexOf("/app") === 0 || pathname.indexOf("/profile") === 0) {
            return true;
        }
        const existingPage = await this.findPageRepo.findPageByPathname(pathname);
        return existingPage ? true : false;
    }
    async addPage(options) {
        const pageExists = await this.pageExists(options.pathname);
        if (pageExists) {
            const clientError = new ClientError("The page already exists");
            clientError.addPropertyError("title", "The page already exists");
            throw clientError;
        }
        const newPage = PageModel.createNewPage(this.getCurrentUserId(), options);
        await this.addNewPage(newPage);
        return newPage;
    }
    async addNewPage(newPage) {
        const newPageRef = doc(collection(HbDb.current, "pages")).withConverter(PageModel);
        newPage.uid = newPageRef.id;
        await setDoc(newPageRef, newPage);
    }
};
__decorate([
    authorize(UserAction.authorPages)
], AddPageRepo.prototype, "addPage", null);
AddPageRepo = __decorate([
    provides(AddPageRepoKey, !HbApp.isStorybook)
], AddPageRepo);
