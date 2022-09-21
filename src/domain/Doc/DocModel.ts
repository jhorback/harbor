import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { IContentType, IDocData, IDocumentReference, IDocumentThumbnail } from "../interfaces/DocumentInterfaces";
import { docTypes } from "./docTypes";



interface ICreateNewDocOptions {
    docType: string;
    title: string;
}

/**
 *
 */
export class DocModel implements IDocData {
    /**
     * Helper method to ensure doc properties when
     * creating a new one.
     * @param options 
     * @returns 
     */
     static createNewDoc(options:ICreateNewDocOptions):DocModel {
        const doc = new DocModel();
        doc.title = options.title;
        doc.docType = options.docType;
        doc.pid = DocModel.tokenize(doc.title);
        doc.uid = `${doc.docType}:${doc.pid}`;
        doc.content = docTypes[doc.docType].defaultContent;
        return doc;
    }

    /** Format docType:pid */
    uid = "";
    /** As referenced in docTypes */
    docType = "";
    /** A tokenized version of the document title */
    pid = "";
    title = "";
    showTitle = true;
    subtitle = null;
    showSubtitle = true;
    thumbUrl = null;
    thumbDescription = null;
    useSubtitleAsThumbDescription = true;
    dateCreated = new Date();
    dateUpdated = new Date();
    authorUid = "";
    content = new Array<IContentType>();

    get documentRef() {
        return `documents/${this.uid}`;
    }

    toDocumentReference = ():IDocumentReference => ({
        uid: this.uid,
        docType: this.docType,
        pid: this.pid,
        documentRef: this.documentRef
    });

    toDocumentThumbnail = ():IDocumentThumbnail => ({
        uid: this.uid,
        docType: this.docType,
        pid: this.pid,
        documentRef: `documents/${this.uid}`,
        title: this.title,
        thumbUrl: this.thumbUrl,
        thumbDescription: this.useSubtitleAsThumbDescription ?
        this.subtitle : this.thumbDescription,
        href: `${docTypes[this.docType].route}/${this.pid}`
    })

    /**
     * Used to tokenize the title to get the page id.
     * @param text 
     * @returns 
     */
    static tokenize(text:string):string {
        return encodeURIComponent(text.split(" ").join("-").replace(/[^a-z0-9]/gi, "-").toLowerCase());
    }

    static toFirestore(doc:DocModel):IDocData {
        return {
            ...doc,
            dateCreated: Timestamp.fromDate(doc.dateCreated ?? new Date()),
            dateUpdated: Timestamp.fromDate(doc.dateUpdated ?? new Date())
        };
    }
    
    static fromFirestore(snapshot: QueryDocumentSnapshot):DocModel {
        const dbDoc = snapshot.data() as IDocData;
        const docModel = new DocModel();
        Object.assign(docModel, dbDoc);
        docModel.dateCreated = (dbDoc.dateCreated as Timestamp).toDate();
        docModel.dateUpdated = (dbDoc.dateUpdated as Timestamp).toDate();
        return docModel;
    }
}