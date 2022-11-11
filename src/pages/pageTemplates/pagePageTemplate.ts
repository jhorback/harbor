import { IPageTemplateDescriptor } from "../../domain/interfaces/PageInterfaces";
import { ContentTypes } from "../../domain/Doc/contentTypes";
import { TextContentData } from "../../doc/contentTypes/textContentType";
import { pageTemplates } from "../../domain/Pages/pageTemplates";


const pagePageType:IPageTemplateDescriptor = {
    key: "page",
    name: "Page",
    description: "A flexible free-form page that can contain any content",
    validContentTypes: [ContentTypes.text, ContentTypes.image],
    defaultContent: [new TextContentData()],
    icon: "article",
    defaultThumbUrl: "/content/thumbs/default-page-thumb.png"
};

pageTemplates.register("page", pagePageType);





