import { doc, getDoc } from "firebase/firestore";
import { docTypes } from "../../document/docTypes";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { IDocument, IDocumentReference, IDocumentThumbnail, IHomePageRepo, IHomePageRepoKey } from "../interfaces/DocumentInterfaces";


interface ISystemApp {
    homePage?:IDocumentReference;
};


@provides<IHomePageRepo>(IHomePageRepoKey, !HbApp.isStorybook)
class HbHomePageRepo implements IHomePageRepo {
    async getDocumentThumbnail(): Promise<IDocumentThumbnail | null> {
        const ref = await this.getHomePageRef();
        if (ref === null) {
            return null;
        }

        const docRef = doc(HbDb.current, "documents", ref.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() === false) {
            return null;
        }
        const document = docSnap.data() as IDocument;

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

    async getHomePageRef():Promise<IDocumentReference|null> {

        const docRef = doc(HbDb.current, "system", "app");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() === false) {
            return null;
        }

        const systemApp = docSnap.data() as ISystemApp;
        return systemApp.homePage || null;
    }

    setHomePage(documentRef: string):Promise<void> {
        throw new Error("Not implemented");
    }
}