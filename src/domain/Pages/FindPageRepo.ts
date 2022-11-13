import { collection, doc, getDoc, getDocs, query, QueryDocumentSnapshot, where } from "firebase/firestore";
import { HbDb } from "../HbDb";
import { PageModel } from "./PageModel";



/**
 * Helper for other repos to ensure the PageModel converter.
 */
export class FindPageRepo {
    async findPage(uid:string):Promise<PageModel|null> {
        const docRef = doc(HbDb.current, "pages", uid).withConverter(PageModel);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() as PageModel : null;
    }

    async findPageByPathname(pathname:string):Promise<PageModel|null> {
        const q = query(collection(HbDb.current, "pages"), where("pathname", "==", pathname))
            .withConverter(PageModel);

        const snapshot = await getDocs(q);
        const pages = snapshot.docs.map((page:QueryDocumentSnapshot<PageModel>) => page.data());
        return pages[0];
    }
}