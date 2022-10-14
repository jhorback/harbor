import { Timestamp } from "firebase/firestore";
import { TemplateResult } from "lit-html";
import { DocModel } from "../Doc/DocModel";
import { IThumbnail } from "./UIInterfaces";


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
    defaultThumbUrl: string;
}


export interface IContentTypeDescriptor {
    type: string;
    name: string;
    description: string;
    render(options:IContentTypeRenderOptions):TemplateResult;
}

export interface IContentTypeRenderOptions {
    state:IContentType;
    index:number;
    inDocEditMode:boolean
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



export const SearchDocsRepoKey:symbol = Symbol("SEARCH_DOCS_REPO");
export interface ISearchDocsRepo {
    searchDocs(options:ISearchDocsOptions):Promise<Array<DocModel>>;
}
export interface ISearchDocsOptions {
    text?:string;
}


export const EditDocRepoKey:symbol = Symbol("EDIT_DOC_REPO");
export type IUnsubscribe = () => void;
export interface IEditDocRepo {
    subscribeToDoc(uid:string, callback:(docModel: DocModel) => void):IUnsubscribe;
    saveDoc(doc: DocModel):void;
}



export const AddDocRepoKey:symbol = Symbol("ADD_DOC_REPO");
export interface IAddDocRepo {
    addDoc(options:IAddNewDocumentOptions):Promise<DocModel>;
}
export interface IAddNewDocumentOptions {
    docType: string;
    title: string;
}

export const DeleteDocRepoKey:symbol = Symbol("DELETE_DOC_REPO");
export interface IDeleteDocRepo {
    deleteDoc(uid:string):Promise<void>;
}




export const HomePageRepoKey:symbol = Symbol("HOME_PAGE_REPO_KEY");
export interface IHomePageRepo {
    getHomePageRef():Promise<IDocumentReference|null>;
    getHomePageThumbnail():Promise<IDocumentThumbnail|null>;
    setHomePage(documentReference: IDocumentReference):Promise<void>;
}
