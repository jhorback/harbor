import { html } from "lit-html";
import { IContentType, IContentTypeDescriptor, IContentTypeRenderOptions } from "../../../domain/interfaces/PageInterfaces";
import { contentTypes } from "../../../domain/Pages/contentTypes";



interface IPageTabsContentDataConstructorOptions {
    canDelete?:boolean;
}

export class PageTabsContentData implements IContentType {
    constructor(options?:IPageTabsContentDataConstructorOptions) {
        this.canDelete = options?.canDelete;
    }
    contentType = "page-tabs";
    labelPlaceholder = "Page tabs";
    label: undefined;
    canDelete?:boolean = false;
    rootPageUID:string = "";
    rootPageUrl:string = "";
    rootPageTitle:string = "";
    rootPageSubtitle:string|null = "";
    tabs:Array<PageTabsTab> = [
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
    ]
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
    icon: "tab",
    defaultData: new PageTabsContentData(),
    render: (options:IContentTypeRenderOptions) => html`
        <hb-page-tabs-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-page-tabs-content>
    `
};

contentTypes.register("page-tabs", pageTabsContentType);