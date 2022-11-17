import { Timestamp } from "firebase/firestore";
import { TemplateResult } from "lit";
import { PageModel } from "../Pages/PageModel";
import { IThumbnail } from "./UIInterfaces";


export interface IContentType {
    contentType: string;
}

/**
 * Describes a page for code.
 * The valid content types,
 * and content template.
 */
export interface IPageTemplateDescriptor {
    key: string;
    name: string;
    description: string;
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
    pathname:string,
    contentIndex:number;
}


/**
 * Describes a document reference for 
 * lookup purposes.
 */
export interface IPageReference {
    uid: string;
    pageTemplate: string;
    pathname: string;
    documentRef: string;
}



export interface IPageThumbnail extends IThumbnail, IPageReference { }

export interface IPageData {
    uid: string;
    pageTemplate: string;
    pathname: string;
    title: string,
    showTitle: boolean;
    subtitle: string|null;
    showSubtitle: boolean;
    thumbUrl: string|null;
    thumbUrls:Array<string>;
    dateCreated: Date|Timestamp;
    dateUpdated: Date|Timestamp;
    authorUid: string;
    content: Array<IContentType>;
}



export const SearchPagesRepoKey:symbol = Symbol("SEARCH_PAGES_REPO");
export interface ISearchPagesRepo {
    searchPages(options:IPageSearchOptions):Promise<Array<PageModel>>;
}
export interface IPageSearchOptions {
    text?:string;
}


export const EditPageRepoKey:symbol = Symbol("EDIT_PAGE_REPO");
export type IUnsubscribe = () => void;
export interface IEditPageRepo {
    subscribeToPage(uid:string, callback:(pageModel: PageModel) => void, signal:AbortSignal):void;
    savePage(page: PageModel):void;
}



export const AddPageRepoKey:symbol = Symbol("ADD_PAGE_REPO");
export interface IAddPageRepo {
    pageExists(pathname:string):Promise<boolean>;
    addPage(options:IAddNewPageOptions):Promise<PageModel>;
}
export interface IAddNewPageOptions {
    pageTemplate: string;
    title: string;
    pathname: string;
}

export const DeletePageRepoKey:symbol = Symbol("DELETE_PAGE_REPO");
export interface IDeletePageRepo {
    deletePage(uid:string):Promise<void>;
}




export const HomePageRepoKey:symbol = Symbol("HOME_PAGE_REPO_KEY");
export interface IHomePageRepo {
    getHomePageRef():Promise<IPageReference|null>;
    getHomePageThumbnail():Promise<IPageThumbnail|null>;
    setHomePage(documentReference: IPageReference):Promise<void>;
}
