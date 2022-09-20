var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, getDoc } from "firebase/firestore";
import { docTypes } from "../Doc/docTypes";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { IHomePageRepoKey } from "../interfaces/DocumentInterfaces";
;
let HbHomePageRepo = class HbHomePageRepo {
    async getHomePageThumbnail() {
        const ref = await this.getHomePageRef();
        if (ref === null) {
            return null;
        }
        const docRef = doc(HbDb.current, "documents", ref.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() === false) {
            return null;
        }
        const document = docSnap.data();
        return {
            uid: document.uid,
            docType: document.docType,
            pid: document.pid,
            documentRef: `documents/${document.uid}`,
            title: document.title,
            thumbUrl: document.thumbUrl,
            thumbDescription: document.useSubtitleAsThumbDescription ?
                document.subtitle : document.thumbDescription,
            href: `${docTypes[document.docType].route}/${document.pid}`
        };
    }
    async getHomePageRef() {
        const docRef = doc(HbDb.current, "system", "app");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() === false) {
            return null;
        }
        const systemApp = docSnap.data();
        return systemApp.homePage || null;
    }
    setHomePage(documentRef) {
        throw new Error("Not implemented");
    }
};
HbHomePageRepo = __decorate([
    provides(IHomePageRepoKey, !HbApp.isStorybook)
], HbHomePageRepo);
