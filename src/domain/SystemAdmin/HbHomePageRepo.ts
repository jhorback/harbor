import { doc, getDoc, setDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { authorize, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import {
    HomePageRepoKey, IHomePageRepo, IPageReference, IPageThumbnail
} from "../interfaces/PageInterfaces";
import { FindPageRepo } from "../Pages/FindPageRepo";


interface ISystemApp {
    homePage?:IPageReference;
};


@provides<IHomePageRepo>(HomePageRepoKey, !HbApp.isStorybook)
class HbHomePageRepo implements IHomePageRepo {
    private findPageRepo:FindPageRepo;

    constructor() {
        this.findPageRepo = new FindPageRepo();
    }

    async getHomePageThumbnail(): Promise<IPageThumbnail | null> {
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

    async getHomePageRef():Promise<IPageReference|null> {
        const systemApp = await this.getSystemApp();
        return systemApp?.homePage || null;
    }

    private async getSystemApp():Promise<ISystemApp|null> {
        const docRef = doc(HbDb.current, "system", "app");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() === false) {
            return null;
        }

        const systemApp = docSnap.data() as ISystemApp;
        return systemApp;
    }

    @authorize(UserAction.editSiteSettings)
    async setHomePage(pageReference: IPageReference):Promise<void> {
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
}