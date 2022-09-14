


export interface IDocumentReference {
    uid: string;
    doctype: string;
    pid: string;
    documentRef: string;
}



export const IHomePageRepoKey:symbol = Symbol("HOME_PAGE_REPO_KEY");


export interface IHomePageRepo {
    getHomePageRef():Promise<IDocumentReference|null>;
    setHomePage(documentRef: string):Promise<void>;
}
