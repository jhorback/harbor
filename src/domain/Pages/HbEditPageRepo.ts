import { doc, FirestoreError, onSnapshot, setDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { NotFoundError, ServerError } from "../Errors";
import { HbApp } from "../HbApp";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import {
    EditPageRepoKey,
    IEditPageRepo
} from "../interfaces/PageInterfaces";
import { FindPageRepo } from "../Pages/FindPageRepo";
import { PageModel } from "./PageModel";



@provides<IEditPageRepo>(EditPageRepoKey, !HbApp.isStorybook)
class EditPageRepo implements IEditPageRepo {
    private findPageRepo:FindPageRepo;
    private currentUser:HbCurrentUser;

    constructor() {
        this.findPageRepo = new FindPageRepo();
        this.currentUser = new HbCurrentUser();
    }
    
    private getCurrentUserId():string {
        const authorId = this.currentUser.uid;
        if (!authorId) {
            throw new Error("The current user is not logged in.");
        }
        return authorId;
    }

    async subscribeToPage(pathname:string, callback:(page: PageModel, initialLoad?:boolean) => void, signal:AbortSignal) {
        
        let initialLoad = true;
        const page = await this.findPageRepo.findPageByPathname(pathname);
        
        if (page === null) {
            throw new NotFoundError(`Page not found: ${pathname}`);
        }

        if (page.isVisible === false && this.currentUser.uid !== page.authorUid) {
            throw new NotFoundError(`Page is not visible: ${pathname}`);
        }

        const unsubscribe = onSnapshot(doc(HbDb.current, "pages", page.uid)
            .withConverter(PageModel), (snapshot) => {                
                const doc = snapshot.data() as PageModel;
                callback(doc, initialLoad);
                initialLoad = false;
            }, (error:FirestoreError) => {
                throw new ServerError(error.message, error);
            });
        
        signal.addEventListener("abort", unsubscribe);
    }

    async savePage(page: PageModel) {
        try {
            await setDoc(doc(HbDb.current, "pages", page.uid)
                .withConverter(PageModel), page);
        } catch (error:any) {
            throw new ServerError(error.message, error);
        }
    }
}