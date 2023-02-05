import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { IAddNewPageOptions, IContentType, IPageData, IPageReference, IPageThumbnail, PageSize } from "../interfaces/PageInterfaces";
import { IListItem } from "../interfaces/UIInterfaces";
import { pageTemplates } from "./pageTemplates";



export interface IPageTitleContent {
    showTitle: boolean;
    showSubtitle: boolean;
    showThumbOption: PageTitleThumbOption;
}

export enum PageTitleThumbOption {
    None = "None",
    Default = "Default",
    Rounded = "Rounded",
    Square = "Square",
    RoundedSquare = "Rounded Square",
    Circle = "Circle"
}

const defaultPageTitleContent = {
    showTitle: true,
    showSubtitle: true,
    showThumbOption: PageTitleThumbOption.None
};

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
        page.displayTitle = options.displayTitle || options.title;
        page.subtitle = options.subtitle ? options.subtitle : null;
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
    isVisible = true;
    pageSize = PageSize.medium;
    /** The page route */
    pathname = "";
    title = "";
    displayTitle = "";
    subtitle:string|null = null;
    titleContent:IPageTitleContent = {...defaultPageTitleContent};
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
        isVisible: this.isVisible,
        pathname: this.pathname,
        documentRef: this.documentRef
    });

    toPageThumbnail = ():IPageThumbnail => ({
        uid: this.uid,
        pageTemplate: this.pageTemplate,
        isVisible: this.isVisible,
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
            isVisible: page.isVisible,
            pageSize: page.pageSize,
            pathname: page.pathname,
            title: page.title,
            displayTitle: page.displayTitle || page.title,
            subtitle: page.subtitle,
            titleContent: {
                showTitle: page.titleContent.showTitle,
                showSubtitle: page.titleContent.showSubtitle,
                showThumbOption: page.titleContent.showThumbOption
            },
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
        pageModel.displayTitle = pageModel.displayTitle || pageModel.title;
        if (!pageModel.titleContent) {
            pageModel.titleContent = {...defaultPageTitleContent};
        }
        return pageModel;
    }
}