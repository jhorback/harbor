import { IDocTypeDescriptor } from "../../interfaces/DocumentInterfaces";
import { ContentTypes } from "../contentTypes";
import { TextContentData } from "../contentTypes/textContentType";
import { docTypes } from "./docTypes";


const docDocType:IDocTypeDescriptor = {
    type: "doc",
    name: "Document",
    route: "/docs",
    description: "A flexible free-form page that can contain any content",
    element: "hb-doc-page",
    validContentTypes: [ContentTypes.text, ContentTypes.image],
    defaultContent: [new TextContentData()],
    icon: "article",
    defaultThumbUrl: "/content/thumbs/default-doc-thumb.png"
};

docTypes.register("doc", docDocType);





