import { StateController } from "@domx/statecontroller";
import { PageController } from "./PageController";
export class PageContentController extends StateController {
    constructor(host) {
        super(host);
        this.page = new PageController(this.host);
        this.host = host;
    }
    get content() {
        return this.page.state.page.content[this.host.contentIndex];
    }
    get state() {
        return {
            inContentEditMode: this.host.contentIndex === this.page.state.activeContentIndex,
            isActive: this.host.contentIndex === this.page.state.activeContentIndex,
            canMoveUp: this.contentIndex > 0,
            canMoveDown: this.contentIndex < this.page.state.page.content.length - 1
        };
    }
}
