import { ContentTypes } from "../contentTypes";
import { pageTemplates } from "../../domain/Pages/pageTemplates";
import { TextContentData } from "../contentTypes/text";
const pagePageType = {
    key: "page",
    name: "Page",
    description: "A flexible free-form page that can contain any content",
    validContentTypes: [ContentTypes.text, ContentTypes.image, ContentTypes.pageList],
    defaultContent: [new TextContentData()],
    icon: "article",
    defaultThumbUrl: "/content/thumbs/default-page-thumb.png"
};
pageTemplates.register("page", pagePageType);
