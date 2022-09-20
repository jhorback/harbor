import { Timestamp } from "firebase/firestore";
import { TextContent } from "../content/contentTypes";
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
        this.thumbUrl = null;
        this.thumbDescription = null;
        this.useSubtitleAsThumbDescription = true;
        this.dateCreated = new Date();
        this.dateUpdated = new Date();
        this.authorUid = "";
        this.content = [new TextContent()];
    }
    /**
     * Helper method to ensure doc properties when
     * creating a new one.
     * @param options
     * @returns
     */
    static createNewDoc(options) {
        const doc = new DocModel();
        doc.title = options.title;
        doc.docType = options.docType;
        doc.pid = DocModel.tokenize(doc.title);
        doc.uid = `${doc.docType}:${doc.pid}`;
        return doc;
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
            ...doc,
            firstLogin: Timestamp.fromDate(doc.dateCreated ?? new Date()),
            lastLogin: Timestamp.fromDate(doc.dateUpdated ?? new Date())
        };
    }
    static fromFirestore(snapshot) {
        const dbDoc = snapshot.data();
        return {
            ...dbDoc,
            dateCreated: dbDoc.dateCreated.toDate(),
            dateUpdated: dbDoc.dateUpdated.toDate()
        };
    }
}
