import { PageContentController } from "../../hb-page/PageContentController";
import { TextContentData } from "./textContentType";


export class TextContentController extends PageContentController<TextContentData> {
    
    get defaultContent():TextContentData {
        return new TextContentData();
    }
}
