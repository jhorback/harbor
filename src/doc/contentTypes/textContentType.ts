import { IContentType, IContentTypeDescriptor } from "../../domain/interfaces/DocumentInterfaces";
import { contentTypes } from "../../domain/Doc/contentTypes";
import { html } from "lit-html";


export class TextContentData implements IContentType {
    contentType = "text";
    text = "";
}

const textContentType:IContentTypeDescriptor = {
    type: "text",
    name: "Text",
    description: "A rich text field",
    render: (state:IContentType) => html`<hb-text-content .state=${state}></hb-text-content>`
};

contentTypes.register("text", textContentType);