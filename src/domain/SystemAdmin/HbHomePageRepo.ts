import { doc, getDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { FindDocRepo } from "../Doc/FindDocRepo";
import {
    IDocumentReference,
    IDocumentThumbnail,
    IHomePageRepo,
    HomePageRepoKey
} from "../interfaces/DocumentInterfaces";


interface ISystemApp {
    homePage?:IDocumentReference;
};


@provides<IHomePageRepo>(HomePageRepoKey, !HbApp.isStorybook)
class HbHomePageRepo implements IHomePageRepo {
    private findDocRepo:FindDocRepo;

    constructor() {
        this.findDocRepo = new FindDocRepo();
    }

    async getHomePageThumbnail(): Promise<IDocumentThumbnail | null> {
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