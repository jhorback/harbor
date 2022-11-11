import { collection, doc, setDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { ClientError } from "../Errors";
import { HbApp } from "../HbApp";
import { authorize, HbCurrentUser, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import {
    AddPageRepoKey, IAddNewPageOptions, IAddPageRepo
} from "../interfaces/PageInterfaces";
import { FindPageRepo } from "./FindPageRepo";KeyboardEvent
import { PageModel } from "./PageModel";


@provides<IAddPageRepo>(AddPageRepoKey, !HbApp.isStorybook)
class AddPageRepo implements IAddPageRepo {
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

    async pageExists(pathname:string): Promise<boolean> {
        const existingPage = await this.findPageRepo.findPageByPathname(pathname);
        return existingPage ? true : false;
    }

    @authorize(UserAction.authorDocuments)
    async addPage(options:IAddNewPageOptions): Promise<PageModel> {

        const pageExists = await this.pageExists(options.pathname);
        if (pageExists) {
            const clientError = new ClientError("The page already exists");
            clientError.addPropertyError("title", "The page already exists");
            throw clientError;
        }

        const newPage = PageModel.createNewPage(this.getCurrentUserId(), options);
        await this.addNewPage(newPage);
        return newPage;
    }

    private async addNewPage(newPage:PageModel) {
        const newPageRef = doc(collection(HbDb.current, "pages")).withConverter(PageModel);
        newPage.uid = newPageRef.id;
        await setDoc(newPageRef, newPage);
    }
}