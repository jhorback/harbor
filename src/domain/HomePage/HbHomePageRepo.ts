import { doc, getDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { IDocumentReference, IHomePageRepo, IHomePageRepoKey } from "../interfaces/DocumentInterfaces";


interface ISystemApp {
    homePage?:IDocumentReference;
};


@provides<IHomePageRepo>(IHomePageRepoKey, !HbApp.isStorybook)
class HbHomePageRepo {

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