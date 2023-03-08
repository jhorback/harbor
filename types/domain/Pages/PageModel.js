import { Timestamp } from "firebase/firestore";
import { PageSize } from "../interfaces/PageInterfaces";
import { contentTypes } from "./contentTypes";
import { pageTemplates } from "./pageTemplates";
export var PageTitleThumbOption;
(function (PageTitleThumbOption) {
    PageTitleThumbOption["None"] = "None";
    PageTitleThumbOption["Default"] = "Default";
    PageTitleThumbOption["Rounded"] = "Rounded";
    PageTitleThumbOption["Square"] = "Square";
    PageTitleThumbOption["RoundedSquare"] = "Rounded Square";
    PageTitleThumbOption["Circle"] = "Circle";
})(PageTitleThumbOption || (PageTitleThumbOption = {}));
const defaultPageTitleContent = {
    showTitle: true,
    showSubtitle: true,
    showThumbOption: PageTitleThumbOption.None
};
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
        this.subtitle = null;
        this.titleContent = { ...defaultPageTitleContent };
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
        if (!pageModel.titleContent) {
            pageModel.titleContent = { ...defaultPageTitleContent };
        }
        // jch - ensure contenttypes have an id
        // this is temporary - could be done in an upgrade task
        // can be removed after next release
        pageModel.content.forEach(c => {
            if (!c.uid) {
                c.uid = contentTypes.newUId();
            }
        });
        return pageModel;
    }
}
