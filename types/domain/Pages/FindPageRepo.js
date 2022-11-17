import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { HbDb } from "../HbDb";
import { PageModel } from "./PageModel";
/**
 * Helper for other repos to ensure the PageModel converter.
 */
export class FindPageRepo {
    async findPage(uid) {
        const docRef = doc(HbDb.current, "pages", uid).withConverter(PageModel);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    }
    async findPageByPathname(pathname) {
        const q = query(collection(HbDb.current, "pages"), where("pathname", "==", pathname))
            .withConverter(PageModel);
        const snapshot = await getDocs(q);
        const pages = snapshot.docs.map((page) => page.data());
        return pages[0] || null;
    }
}
