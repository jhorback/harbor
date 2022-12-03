import { hostEvent, Product, StateController } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { EditFileRepoKey, IEditFileRepo } from "../../domain/interfaces/FileInterfaces";
import { DeletePageRepoKey, IDeletePageRepo } from "../../domain/interfaces/PageInterfaces";
import "../../domain/Pages/HbDeletePageRepo";
import { DeleteFileDialog } from "./hb-delete-file-dialog";


export class DeleteFileEvent extends Event {
    static eventType = "delete-file";
    name:string;
    constructor(name:string) {
        super(DeleteFileEvent.eventType, {bubbles: true});
        this.name = name;
    }
}

export class FileDeletedEvent extends Event {
    static eventType = "file-deleted";
    constructor() {
        super(FileDeletedEvent.eventType, {bubbles: true});
    }
}

export class DeleteFileController extends StateController {

    host:DeleteFileDialog;

    constructor(deleteFileDialog:DeleteFileDialog) {
        super(deleteFileDialog);
        this.host = deleteFileDialog;
    }

    @inject<IEditFileRepo>(EditFileRepoKey)
    private editFileRepo!:IEditFileRepo;

    @hostEvent(DeleteFileEvent)
    async deleteFile(event:DeleteFileEvent) {
        await this.editFileRepo.deleteFile(event.name);
        this.host.dispatchEvent(new FileDeletedEvent());
        this.host.close();
    }
}
