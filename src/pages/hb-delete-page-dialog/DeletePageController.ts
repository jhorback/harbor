import { hostEvent, Product, StateController } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { DeletePageRepoKey, IDeletePageRepo } from "../../domain/interfaces/PageInterfaces";
import "../../domain/Pages/HbDeletePageRepo";
import { DeletePageDialog } from "./hb-delete-page-dialog";


export class DeletePageEvent extends Event {
    static eventType = "delete-page";
    uid:string;
    constructor(uid:string) {
        super(DeletePageEvent.eventType, {bubbles: true});
        this.uid = uid;
    }
}

export class PageDeletedEvent extends Event {
    static eventType = "page-deleted";
    constructor() {
        super(PageDeletedEvent.eventType, {bubbles: true});
    }
}

export class DeletePageController extends StateController {

    host:DeletePageDialog;

    constructor(deletePageDialog:DeletePageDialog) {
        super(deletePageDialog);
        this.host = deletePageDialog;
    }

    @inject<IDeletePageRepo>(DeletePageRepoKey)
    private deletePageRepo!:IDeletePageRepo;

    @hostEvent(DeletePageEvent)
    async deletePage(event:DeletePageEvent) {
        await this.deletePageRepo.deletePage(event.uid);
        this.host.dispatchEvent(new PageDeletedEvent());
        this.host.close();
    }
}
