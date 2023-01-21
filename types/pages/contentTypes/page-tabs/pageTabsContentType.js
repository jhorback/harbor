import { html } from "lit-html";
import { contentTypes } from "../../../domain/Pages/contentTypes";
export class PageTabsContentData {
    constructor(options) {
        this.contentType = "page-tabs";
        this.labelPlaceholder = "Page tabs";
        this.canDelete = false;
        this.rootPageUID = "";
        this.rootPageUrl = "";
        this.rootPageTitle = "";
        this.rootPageSubtitle = "";
        this.tabs = [
        // {
        //     tabName: "Page 1 Tab",
        //     url: "",
        //     pageUid: ""
        // }, {
        //     tabName: "Page 2 Tab",
        //     url: "",
        //     pageUid: ""
        // }, {
        //     tabName: "Page 3 Tab",
        //     url: "",
        //     pageUid: ""
        // }
        ];
        this.canDelete = options?.canDelete;
    }
}
const pageTabsContentType = {
    type: "page-tabs",
    name: "Page Tabs",
    description: "A tabbed navigation component",
    icon: "tab",
    defaultData: new PageTabsContentData(),
    render: (options) => html `
        <hb-page-tabs-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-page-tabs-content>
    `
};
contentTypes.register("page-tabs", pageTabsContentType);
