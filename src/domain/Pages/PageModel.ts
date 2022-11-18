import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { IAddNewPageOptions, IContentType, IPageData, IPageReference, IPageThumbnail } from "../interfaces/PageInterfaces";
import { IListItem } from "../interfaces/UIInterfaces";
import { pageTemplates } from "./pageTemplates";




/**
 *
 */
export class PageModel implements IPageData {
    /**
     * Helper method to ensure page properties when
     * creating a new one.
     * @param options 
     * @returns 
     */
     static createNewPage(authorUid: string, options:IAddNewPageOptions):PageModel {
        const page = new PageModel();
        page.authorUid = authorUid;
        page.title = options.title;
        page.pathname = options.pathname;
        page.pageTemplate = options.pageTemplate;
        page.content = pageTemplates.get(page.pageTemplate).defaultContent;
        page.thumbUrl = pageTemplates.get(page.pageTemplate).defaultThumbUrl;
        return page;
    }

    /** Generated on create in db */
    uid = "";
    /** Page template key referenced in pageTemplates */
    pageTemplate = "page";
    /** The page route */
    pathname = "";
    title = "";
    showTitle = true;
    subtitle:string|null = null;
    showSubtitle = true;
    thumbUrl = "";
    thumbUrls:Array<string> = new Array();
    dateCreated = new Date();
    dateUpdated = new Date();
    authorUid = "";
    content = new Array<IContentType>();

    get documentRef() {
        return `pages/${this.uid}`;
    }

    toPageReference = ():IPageReference => ({
        uid: this.uid,
        pageTemplate: this.pageTemplate,
        pathname: this.pathname,
        documentRef: this.documentRef
    });

    toPageThumbnail = ():IPageThumbnail => ({
        uid: this.uid,
        pageTemplate: this.pageTemplate,
        pathname: this.pathname,
        documentRef: this.documentRef,
        title: this.title,
        thumbUrl: this.thumbUrl,
        thumbDescription: this.subtitle,
        href: this.pathname
    });

    toListItem = ():IListItem => ({
        uid: this.uid,
        text: this.title,
        description: this.subtitle,
        icon: pageTemplates.get(this.pageTemplate).icon
    });

    /**
     * Used to tokenize the title to get the page id.
     * @param text 
     * @returns 
     */
    static tokenize(text:string):string {
        return encodeURIComponent(text.split(" ").join("-").replace(/[^a-z0-9]/gi, "-").toLowerCase());
    }

    static toFirestore(page:PageModel):IPageData {
        return {
            uid: page.uid,
            authorUid: page.authorUid,
            pageTemplate: page.pageTemplate,
            pathname: page.pathname,
            title: page.title,
            showTitle: page.showTitle,
            subtitle: page.subtitle,
            showSubtitle: page.showSubtitle,
            thumbUrl: page.thumbUrl,
            thumbUrls: page.thumbUrls,            
            dateCreated: Timestamp.fromDate(page.dateCreated ?? new Date()),
            dateUpdated: Timestamp.fromDate(page.dateUpdated ?? new Date()),
            content: page.content.map(c => ({...c}))
        };
    }
    
    static fromFirestore(snapshot: QueryDocumentSnapshot):PageModel {
        const dbPage = snapshot.data() as IPageData;
        const pageModel = new PageModel();
        Object.assign(pageModel, dbPage);
        pageModel.dateCreated = (dbPage.dateCreated as Timestamp).toDate();
        pageModel.dateUpdated = (dbPage.dateUpdated as Timestamp).toDate();
        return pageModel;
    }
}