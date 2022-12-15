var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, StateController } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { DeletePageRepoKey } from "../../domain/interfaces/PageInterfaces";
import "../../domain/Pages/HbDeletePageRepo";
export class DeletePageEvent extends Event {
    static { this.eventType = "delete-page"; }
    constructor(uid) {
        super(DeletePageEvent.eventType, { bubbles: true });
        this.uid = uid;
    }
}
export class PageDeletedEvent extends Event {
    static { this.eventType = "page-deleted"; }
    constructor() {
        super(PageDeletedEvent.eventType, { bubbles: true });
    }
}
export class DeletePageController extends StateController {
    constructor(deletePageDialog) {
        super(deletePageDialog);
        this.host = deletePageDialog;
    }
    async deletePage(event) {
        await this.deletePageRepo.deletePage(event.uid);
        this.host.dispatchEvent(new PageDeletedEvent());
        this.host.close();
    }
}
__decorate([
    inject(DeletePageRepoKey)
], DeletePageController.prototype, "deletePageRepo", void 0);
__decorate([
    hostEvent(DeletePageEvent)
], DeletePageController.prototype, "deletePage", null);
