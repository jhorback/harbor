var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { StateController, windowEvent } from "@domx/statecontroller";
import { contentTypes } from "../../domain/Pages/contentTypes";
import { PageController, PageLoadedEvent } from "./PageController";
export class PageContentController extends StateController {
    constructor(host) {
        super(host);
        this.host = host;
        this.page = new PageController(this.host);
        this.page.stateUpdated = () => this.stateUpdated();
    }
    get defaultContent() {
        throw new Error("Not implemented");
    }
    get content() {
        // make sure we have content and it matches the correct type
        // otherwise return the default content
        const contentType = this.page.state.page.content[this.host.contentIndex];
        return !contentType ? this.defaultContent :
            contentType.contentType !== this.defaultContent.contentType ?
                this.defaultContent : contentType;
    }
    get contentState() {
        return {
            contentTypeName: this.getContentTypeName(),
            inContentEditMode: this.host.contentIndex === this.page.state.editableContentIndex,
            otherActive: this.page.state.activeContentIndex !== -1 && this.host.contentIndex !== this.page.state.activeContentIndex,
            canMoveUp: this.page.state.editableContentIndex === -1 && this.host.contentIndex > 0,
            canMoveDown: this.page.state.editableContentIndex === -1 && this.host.contentIndex < this.page.state.page.content.length - 1
        };
    }
    getContentTypeName() {
        try {
            const content = this.page.state.page.content[this.host.contentIndex];
            return contentTypes.all().find(c => content.contentType === c.type)?.name || "Content";
        }
        catch (e) {
            return "Content Error";
        }
    }
    contentPageLoaded(event) {
        this.requestUpdate("PageLoaded");
    }
}
__decorate([
    windowEvent(PageLoadedEvent, { capture: false })
], PageContentController.prototype, "contentPageLoaded", null);
