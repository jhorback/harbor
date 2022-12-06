import { HbCurrentUser } from "../../../domain/HbCurrentUser";
import { PageContentController } from "../../hb-page/PageContentController";
import { PageTabsContentData } from "./pageTabsContentType";



export class PageTabsContentController extends PageContentController<PageTabsContentData> {

    state:PageTabsContentData = { ...this.content };

    stateUpdated() {
        this.state = { ...this.content };        
    }

    private currentUser:HbCurrentUser = new HbCurrentUser();

    getPageVisibility(isVisible:boolean):string {
        return isVisible ? "visible" :
            this.page.state.page.authorUid === this.currentUser.uid ?
            "author" : "hidden";
    }

    
}