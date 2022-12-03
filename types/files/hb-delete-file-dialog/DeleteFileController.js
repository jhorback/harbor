var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, StateController } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { EditFileRepoKey } from "../../domain/interfaces/FileInterfaces";
import "../../domain/Pages/HbDeletePageRepo";
export class DeleteFileEvent extends Event {
    constructor(name) {
        super(DeleteFileEvent.eventType, { bubbles: true });
        this.name = name;
    }
}
DeleteFileEvent.eventType = "delete-file";
export class FileDeletedEvent extends Event {
    constructor() {
        super(FileDeletedEvent.eventType, { bubbles: true });
    }
}
FileDeletedEvent.eventType = "file-deleted";
export class DeleteFileController extends StateController {
    constructor(deleteFileDialog) {
        super(deleteFileDialog);
        this.host = deleteFileDialog;
    }
    async deleteFile(event) {
        await this.editFileRepo.deleteFile(event.name);
        this.host.dispatchEvent(new FileDeletedEvent());
        this.host.close();
    }
}
__decorate([
    inject(EditFileRepoKey)
], DeleteFileController.prototype, "editFileRepo", void 0);
__decorate([
    hostEvent(DeleteFileEvent)
], DeleteFileController.prototype, "deleteFile", null);
