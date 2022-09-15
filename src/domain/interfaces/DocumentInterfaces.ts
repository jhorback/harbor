


export interface IDocumentReference {
    uid: string;
    docType: string;
    pid: string;
    documentRef: string;
}

export interface IThumbnail {
    title: string;
    thumbUrl: string|null;
    thumbDescription: string|null;
    href: string;
}

export interface IDocumentThumbnail extends IThumbnail, IDocumentReference { }

export interface IDocument {
    uid: string;
    docType: string;
    pid: string;
    title: string,
    showTitle: boolean,
    subtitle: string,
    showSubtitle: boolean,
    thumbUrl: string,
    thumbDescription: string,
    useSubtitleAsThumbDescription: string,
    dateCreated: Date,
    dateUpdated: Date,
    author: {
        userRef: string,
        displayName: string,
        photoURL?: string
    }
}



export const IHomePageRepoKey:symbol = Symbol("HOME_PAGE_REPO_KEY");


export interface IHomePageRepo {
    getHomePageRef():Promise<IDocumentReference|null>;
    getDocumentThumbnail():Promise<IDocumentThumbnail|null>;
    setHomePage(documentRef: string):Promise<void>;
}
