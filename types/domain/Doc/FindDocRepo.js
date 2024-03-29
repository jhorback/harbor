import { doc, getDoc } from "firebase/firestore";
import { HbDb } from "../HbDb";
import { DocModel } from "./DocModel";
/**
 * Helper for other repos to ensure the DocModel converter.
 */
export class FindDocRepo {
    async findDoc(uid) {
        const docRef = doc(HbDb.current, "documents", uid).withConverter(DocModel);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    }
}
