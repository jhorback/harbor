import "../../../domain/Files/HbFindFileRepo";
import { PageContentController } from "../../hb-page/PageContentController";
import { PageListContentData } from "./pageListContentType";


export class PageListContentController extends PageContentController<PageListContentData> {

    state:PageListContentData = { ...this.content };

    stateUpdated() {
        this.state = { ...this.content };
    }
}
