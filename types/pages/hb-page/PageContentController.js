import { StateController } from "@domx/statecontroller";
import { PageController } from "./PageController";
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
        // var contentType =  this.page.state.page.content[this.host.contentIndex];
        // return contentType ? contentType as TContentType : this.defaultContent;
        const contentType = this.page.state.page.content[this.host.contentIndex];
        if (contentType && contentType.contentType !== this.defaultContent.contentType) {
            console.warn("CONTENT TYPE MISMATCH:", contentType.contentType, "AND", this.defaultContent.contentType);
        }
        // make sure we have content and it matches the correct type
        // otherwise return the default content
        return !contentType ? this.defaultContent :
            contentType.contentType !== this.defaultContent.contentType ?
                this.defaultContent : contentType;
    }
    get contentState() {
        return {
            inContentEditMode: this.host.contentIndex === this.page.state.editableContentIndex,
            isActive: this.host.contentIndex === this.page.state.activeContentIndex,
            canMoveUp: this.page.state.editableContentIndex === -1 && this.host.contentIndex > 0,
            canMoveDown: this.page.state.editableContentIndex === -1 && this.host.contentIndex < this.page.state.page.content.length - 1
        };
    }
}
