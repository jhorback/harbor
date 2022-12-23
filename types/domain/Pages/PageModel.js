import { Timestamp } from "firebase/firestore";
import { PageSize } from "../interfaces/PageInterfaces";
import { pageTemplates } from "./pageTemplates";
/**
 *
 */
export class PageModel {
    constructor() {
        /** Generated on create in db */
        this.uid = "";
        /** Page template key referenced in pageTemplates */
        this.pageTemplate = "page";
        this.isVisible = true;
        this.pageSize = PageSize.medium;
        /** The page route */
        this.pathname = "";
        this.title = "";
        this.displayTitle = "";
        this.showTitle = true;
        this.subtitle = null;
        this.showSubtitle = true;
        this.thumbUrl = "";
        this.thumbUrls = new Array();
        this.dateCreated = new Date();
        this.dateUpdated = new Date();
        this.authorUid = "";
        this.content = new Array();
        this.toPageReference = () => ({
            uid: this.uid,
            pageTemplate: this.pageTemplate,
            isVisible: this.isVisible,
            pathname: this.pathname,
            documentRef: this.documentRef
        });
        this.toPageThumbnail = () => ({
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
        this.toListItem = () => ({
            uid: this.uid,
            text: this.title,
            description: this.subtitle,
            icon: pageTemplates.get(this.pageTemplate).icon
        });
    }
    /**
     * Helper method to ensure page properties when
     * creating a new one.
     * @param options
     * @returns
     */
    static createNewPage(authorUid, options) {
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
    get documentRef() {
        return `pages/${this.uid}`;
    }
    /**
     * Used to tokenize the title to get the page id.
     * @param text
     * @returns
     */
    static tokenize(text) {
        return encodeURIComponent(text.split(" ").join("-").replace(/[^a-z0-9]/gi, "-").toLowerCase());
    }
    static toFirestore(page) {
        return {
            uid: page.uid,
            authorUid: page.authorUid,
            pageTemplate: page.pageTemplate,
            isVisible: page.isVisible,
            pageSize: page.pageSize,
            pathname: page.pathname,
            title: page.title,
            displayTitle: page.displayTitle || page.title,
            showTitle: page.showTitle,
            subtitle: page.subtitle,
            showSubtitle: page.showSubtitle,
            thumbUrl: page.thumbUrl,
            thumbUrls: page.thumbUrls,
            dateCreated: Timestamp.fromDate(page.dateCreated ?? new Date()),
            dateUpdated: Timestamp.fromDate(page.dateUpdated ?? new Date()),
            content: page.content.map(c => ({ ...c }))
        };
    }
    static fromFirestore(snapshot) {
        const dbPage = snapshot.data();
        const pageModel = new PageModel();
        Object.assign(pageModel, dbPage);
        pageModel.dateCreated = dbPage.dateCreated.toDate();
        pageModel.dateUpdated = dbPage.dateUpdated.toDate();
        pageModel.displayTitle = pageModel.displayTitle || pageModel.title;
        return pageModel;
    }
}
