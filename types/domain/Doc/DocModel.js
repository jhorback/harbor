import { Timestamp } from "firebase/firestore";
import { docTypes } from "./docTypes";
/**
 *
 */
export class DocModel {
    constructor() {
        /** Format docType:pid */
        this.uid = "";
        /** As referenced in docTypes */
        this.docType = "";
        /** A tokenized version of the document title */
        this.pid = "";
        this.title = "";
        this.showTitle = true;
        this.subtitle = null;
        this.showSubtitle = true;
        this.thumbUrl = "";
        this.thumbUrls = new Array();
        this.thumbDescription = null;
        this.useSubtitleAsThumbDescription = true;
        this.dateCreated = new Date();
        this.dateUpdated = new Date();
        this.authorUid = "";
        this.content = new Array();
        this.toDocumentReference = () => ({
            uid: this.uid,
            docType: this.docType,
            pid: this.pid,
            documentRef: this.documentRef
        });
        this.toDocumentThumbnail = () => ({
            uid: this.uid,
            docType: this.docType,
            pid: this.pid,
            documentRef: `documents/${this.uid}`,
            title: this.title,
            thumbUrl: this.thumbUrl,
            thumbDescription: this.useSubtitleAsThumbDescription ?
                this.subtitle : this.thumbDescription,
            href: `${docTypes.get(this.docType).route}/${this.pid}`
        });
        this.toListItem = () => ({
            uid: this.uid,
            text: this.title,
            description: this.useSubtitleAsThumbDescription ?
                this.subtitle : this.thumbDescription,
            icon: docTypes.get(this.docType).icon
        });
    }
    /**
     * Helper method to ensure doc properties when
     * creating a new one.
     * @param options
     * @returns
     */
    static createNewDoc(authorUid, options) {
        const doc = new DocModel();
        doc.authorUid = authorUid;
        doc.title = options.title;
        doc.docType = options.docType;
        doc.pid = DocModel.tokenize(doc.title);
        doc.uid = `${doc.docType}:${doc.pid}`;
        doc.content = docTypes.get(doc.docType).defaultContent;
        doc.thumbUrl = docTypes.get(doc.docType).defaultThumbUrl;
        return doc;
    }
    get documentRef() {
        return `documents/${this.uid}`;
    }
    /**
     * Used to tokenize the title to get the page id.
     * @param text
     * @returns
     */
    static tokenize(text) {
        return encodeURIComponent(text.split(" ").join("-").replace(/[^a-z0-9]/gi, "-").toLowerCase());
    }
    static toFirestore(doc) {
        return {
            uid: doc.uid,
            authorUid: doc.authorUid,
            docType: doc.docType,
            pid: doc.pid,
            title: doc.title,
            showTitle: doc.showTitle,
            subtitle: doc.subtitle,
            showSubtitle: doc.showSubtitle,
            thumbUrl: doc.thumbUrl,
            thumbUrls: doc.thumbUrls,
            thumbDescription: doc.thumbDescription,
            useSubtitleAsThumbDescription: doc.useSubtitleAsThumbDescription,
            dateCreated: Timestamp.fromDate(doc.dateCreated ?? new Date()),
            dateUpdated: Timestamp.fromDate(doc.dateUpdated ?? new Date()),
            content: doc.content.map(c => ({ ...c }))
        };
    }
    static fromFirestore(snapshot) {
        const dbDoc = snapshot.data();
        const docModel = new DocModel();
        Object.assign(docModel, dbDoc);
        docModel.dateCreated = dbDoc.dateCreated.toDate();
        docModel.dateUpdated = dbDoc.dateUpdated.toDate();
        return docModel;
    }
}
