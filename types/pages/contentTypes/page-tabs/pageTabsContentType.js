import { html } from "lit-html";
import { contentTypes } from "../../../domain/Pages/contentTypes";
export class PageTabsContentData {
    constructor() {
        this.contentType = "page-tabs";
        this.rootPageUID = "";
        this.rootPageUrl = "";
        this.rootPageTitle = "";
        this.rootPageSubtitle = "";
        this.tabs = [{
                tabName: "Page 1 Tab",
                url: "",
                pageUid: ""
            }, {
                tabName: "Page 2 Tab",
                url: "",
                pageUid: ""
            }, {
                tabName: "Page 3 Tab",
                url: "",
                pageUid: ""
            }];
    }
}
const pageTabsContentType = {
    type: "page-tabs",
    name: "Page Tabs",
    description: "A tabbed navigation component",
    icon: "grid_view",
    defaultData: new PageTabsContentData(),
    render: (options) => html `
        <hb-page-tabs-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-page-tabs-content>
    `
};
contentTypes.register("page-tabs", pageTabsContentType);
