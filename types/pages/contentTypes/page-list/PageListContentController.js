import "../../../domain/Files/HbFindFileRepo";
import { PageContentController } from "../../hb-page/PageContentController";
export class PageListContentController extends PageContentController {
    constructor() {
        super(...arguments);
        this.state = { ...this.content };
    }
    stateUpdated() {
        this.state = { ...this.content };
    }
}
