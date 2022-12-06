import { html } from "lit-html";
import { IContentType, IContentTypeDescriptor, IContentTypeRenderOptions } from "../../../domain/interfaces/PageInterfaces";
import { contentTypes } from "../../../domain/Pages/contentTypes";



export class PageTabsContentData implements IContentType {
    contentType = "page-tabs";
    rootPageUID:string = "";
    rootPageUrl:string = "";
    rootPageTitle:string = "";
    rootPageSubtitle:string = "";
    tabs:Array<PageTabsTab> = [{
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
    }]
}

export interface PageTabsTab {
    tabName:string;
    url:string;
    pageUid:string;
}



const pageTabsContentType:IContentTypeDescriptor = {
    type: "page-tabs",
    name: "Page Tabs",
    description: "A tabbed navigation component",
    icon: "grid_view",
    defaultData: new PageTabsContentData(),
    render: (options:IContentTypeRenderOptions) => html`
        <hb-page-tabs-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-page-tabs-content>
    `
};

contentTypes.register("page-tabs", pageTabsContentType);