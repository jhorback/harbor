import { IContentType, IContentTypeDescriptor } from "../../domain/interfaces/DocumentInterfaces";
import { contentTypes } from "../../domain/Doc/contentTypes";


export class TextContentData implements IContentType {
    contentType = "text";
    text = "";
}

const textContentType:IContentTypeDescriptor = {
    type: "text",
    name: "Text",
    description: "A rich text field",
    element: "hb-text-content"
};

contentTypes.register("text", textContentType);