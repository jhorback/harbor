import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { IDocumentReference, IHomePageRepo, IHomePageRepoKey } from "../interfaces/DocumentInterfaces";




@provides<IHomePageRepo>(IHomePageRepoKey, !HbApp.isStorybook)
class HbHomePageRepo {

    getHomePageRef():Promise<IDocumentReference|null> {
        return new Promise((resolve, reject) => {
            //resolve(null);
            resolve({
                uid: "doc:home",
                doctype: "doc",
                pid: "home",
                documentRef: "docs/doc:home"
            })
        });
    }

    setHomePage(documentRef: string):Promise<void> {
        throw new Error("Not implemented");
    }
}