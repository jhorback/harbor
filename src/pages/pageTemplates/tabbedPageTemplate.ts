import { IPageTemplateDescriptor } from "../../domain/interfaces/PageInterfaces";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
import { PageTabsContentData } from "../contentTypes/page-tabs/pageTabsContentType";


const tabbedPageTemplate:IPageTemplateDescriptor = {
    key: "tabbed-page",
    name: "Tabbed Page",
    description: "The root page containing page tabs",
    validContentTypes: [],
    defaultContent: [new PageTabsContentData({canDelete: false})],
    icon: "tab",
    defaultThumbUrl: "/content/thumbs/default-page-thumb.png"
};

pageTemplates.register("tabbed-page", tabbedPageTemplate);
