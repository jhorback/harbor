import { html } from "lit-html";
import { contentTypes } from "../../../domain/Pages/contentTypes";
export var PageListDisplay;
(function (PageListDisplay) {
    PageListDisplay["verticalCard"] = "vertical-card";
    PageListDisplay["horizontalCard"] = "horizontal-card";
    PageListDisplay["textOnly"] = "textOnly";
})(PageListDisplay || (PageListDisplay = {}));
export class PageListContentData {
    constructor() {
        this.contentType = "page-list";
        this.display = PageListDisplay.verticalCard;
        this.pages = new Array();
    }
}
const pageListContentType = {
    type: "page-list",
    name: "Page List",
    description: "A list of page thumbnail cards",
    icon: "grid_view",
    defaultData: new PageListContentData(),
    render: (options) => html `
        <hb-page-list-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-page-list-content>
    `
};
contentTypes.register("page-list", pageListContentType);
