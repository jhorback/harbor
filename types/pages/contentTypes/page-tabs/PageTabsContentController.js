import { HbCurrentUser } from "../../../domain/HbCurrentUser";
import { PageContentController } from "../../hb-page/PageContentController";
export class PageTabsContentController extends PageContentController {
    constructor() {
        super(...arguments);
        this.state = { ...this.content };
        this.currentUser = new HbCurrentUser();
    }
    stateUpdated() {
        this.state = { ...this.content };
    }
    getPageVisibility(isVisible) {
        return isVisible ? "visible" :
            this.page.state.page.authorUid === this.currentUser.uid ?
                "author" : "hidden";
    }
}
