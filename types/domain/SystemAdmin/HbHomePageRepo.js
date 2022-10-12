var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, getDoc, setDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { FindDocRepo } from "../Doc/FindDocRepo";
import { HomePageRepoKey } from "../interfaces/DocumentInterfaces";
import { authorize, UserAction } from "../HbCurrentUser";
;
let HbHomePageRepo = class HbHomePageRepo {
    constructor() {
        this.findDocRepo = new FindDocRepo();
    }
    async getHomePageThumbnail() {
        const ref = await this.getHomePageRef();
        if (ref === null) {
            return null;
        }
        const document = await this.findDocRepo.findDoc(ref.uid);
        if (document === null) {
            return null;
        }
        return document.toDocumentThumbnail();
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
    async setHomePage(documentReference) {
        const systemApp = await this.getSystemApp() || {};
        systemApp.homePage = {
            uid: documentReference.uid,
            docType: documentReference.docType,
            pid: documentReference.pid,
            documentRef: documentReference.documentRef
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
