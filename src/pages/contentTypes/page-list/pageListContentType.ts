import { html } from "lit-html";
import { IContentType, IContentTypeDescriptor, IContentTypeRenderOptions, IPageThumbnail } from "../../../domain/interfaces/PageInterfaces";
import { contentTypes } from "../../../domain/Pages/contentTypes";


export enum PageListDisplay {
    verticalCard = "Card",
    horizontalCard = "Horizontal Card",
    textOnly = "Text Only"
}

export class PageListContentData implements IContentType {
    contentType = "page-list";
    display:PageListDisplay = PageListDisplay.verticalCard;
    pages:Array<IPageThumbnail> = new Array();
}


const pageListContentType:IContentTypeDescriptor = {
    type: "page-list",
    name: "Page List",
    description: "A list of page thumbnail cards",
    icon: "grid_view",
    defaultData: new PageListContentData(),
    render: (options:IContentTypeRenderOptions) => html`
        <hb-page-list-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-page-list-content>
    `
};

contentTypes.register("page-list", pageListContentType);