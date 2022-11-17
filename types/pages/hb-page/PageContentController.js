import { StateController } from "@domx/statecontroller";
import { PageController } from "./PageController";
export class PageContentController extends StateController {
    constructor(host) {
        super(host);
        this.host = host;
        this.page = new PageController(this.host);
        this.page.stateUpdated = () => this.stateUpdated();
    }
    get content() {
        return this.page.state.page.content[this.host.contentIndex];
    }
    get contentState() {
        return {
            inContentEditMode: this.host.contentIndex === this.page.state.activeContentIndex,
            isActive: this.host.contentIndex === this.page.state.activeContentIndex,
            canMoveUp: this.page.state.activeContentIndex === -1 && this.host.contentIndex > 0,
            canMoveDown: this.page.state.activeContentIndex === -1 && this.host.contentIndex < this.page.state.page.content.length - 1
        };
    }
}
