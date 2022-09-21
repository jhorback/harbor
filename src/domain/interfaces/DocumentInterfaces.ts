import { Timestamp } from "firebase/firestore";


export interface IContentType {
    contentType: string;
}

/**
 * Describes a document for code.
 * The route, element, valid content types,
 * and content template.
 */
export interface IDocTypeDescriptor {
    type: string;
    name: string;
    description: string;
    route: string;
    element: string;
    validContentTypes: Array<string>;
    defaultContent: Array<IContentType>;
    icon: string;
}

/**
 * Describes a document reference for 
 * lookup purposes.
 */
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

export interface IDocData {
    uid: string;
    docType: string;
    pid: string;
    title: string,
    showTitle: boolean;
    subtitle: string|null;
    showSubtitle: boolean;
    thumbUrl: string|null;
    thumbDescription: string|null;
    useSubtitleAsThumbDescription: boolean;
    dateCreated: Date|Timestamp;
    dateUpdated: Date|Timestamp;
    authorUid: string;
    content: Array<IContentType>;
}


export const AddDocRepoKey:symbol = Symbol("ADD_DOC_REPO");


export interface IAddNewDocumentOptions {
    docType: string;
    title: string;
}

export interface IAddDocRepo {
    addDoc(options:IAddNewDocumentOptions):Promise<IDocumentReference>;
}



export const HomePageRepoKey:symbol = Symbol("HOME_PAGE_REPO_KEY");


export interface IHomePageRepo {
    getHomePageRef():Promise<IDocumentReference|null>;
    getHomePageThumbnail():Promise<IDocumentThumbnail|null>;
    setHomePage(documentRef: string):Promise<void>;
}
