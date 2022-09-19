import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { TextContent } from "../../content/contentTypes";
import { IContentType, IDocData } from "../interfaces/DocumentInterfaces";



interface ICreateNewDocOptions {
    docType: string;
    title: string;
}

/**
 *
 */
export class DocModel implements IDocData {

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
    content = [new TextContent()];

    /**
     * Helper method to ensure doc properties when
     * creating a new one.
     * @param options 
     * @returns 
     */
    static createNewDoc(options:ICreateNewDocOptions):IDocData {
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
    static tokenize(text:string):string {
        return encodeURIComponent(text.split(" ").join("-").replace(/[^a-z0-9]/gi, "-").toLowerCase());
    }

    static toFirestore(doc:IDocData) {
        return {
            ...doc,
            firstLogin: Timestamp.fromDate(doc.dateCreated ?? new Date()),
            lastLogin: Timestamp.fromDate(doc.dateUpdated ?? new Date())
        };
    }

    static fromFirestore(snapshot: QueryDocumentSnapshot):IDocData {
        const dbDoc = snapshot.data();
        return {
            ...dbDoc,
            dateCreated: dbDoc.dateCreated.toDate(),
            dateUpdated: dbDoc.dateUpdated.toDate()
        } as IDocData;
    }
}