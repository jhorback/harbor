var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, getDoc, setDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { authorize, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { HomePageRepoKey } from "../interfaces/PageInterfaces";
import { FindPageRepo } from "../Pages/FindPageRepo";
;
let HbHomePageRepo = class HbHomePageRepo {
    constructor() {
        this.findPageRepo = new FindPageRepo();
    }
    async getHomePageThumbnail() {
        const ref = await this.getHomePageRef();
        if (ref === null) {
            return null;
        }
        const page = await this.findPageRepo.findPage(ref.uid);
        if (page === null) {
            return null;
        }
        return page.toPageThumbnail();
    }
    async getHomePageRef() {
        const systemApp = await this.getSystemApp();
        return systemApp?.homePage || null;
    }
    async getSystemApp() {
        const docRef = doc(HbDb.current, "system", "app");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() === false) {
            return null;
        }
        const systemApp = docSnap.data();
        return systemApp;
    }
    async setHomePage(pageReference) {
        const systemApp = await this.getSystemApp() || {};
        systemApp.homePage = {
            uid: pageReference.uid,
            pageTemplate: pageReference.pageTemplate,
            isVisible: pageReference.isVisible,
            pathname: pageReference.pathname,
            documentRef: pageReference.documentRef
        };
        await setDoc(doc(HbDb.current, "system", "app"), systemApp);
    }
};
__decorate([
    authorize(UserAction.editSiteSettings)
], HbHomePageRepo.prototype, "setHomePage", null);
HbHomePageRepo = __decorate([
    provides(HomePageRepoKey, !HbApp.isStorybook)
], HbHomePageRepo);
