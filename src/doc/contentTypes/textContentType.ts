import { IContentType, IContentTypeDescriptor, IContentTypeRenderOptions } from "../../domain/interfaces/DocumentInterfaces";
import { contentTypes } from "../../domain/Doc/contentTypes";
import { html } from "lit-html";


export class TextContentData implements IContentType {
    static of(text:string):TextContentData {
        const data = new TextContentData();
        data.text = text;
        return data;
    }
    contentType = "text";
    text = "";
}

const textContentType:IContentTypeDescriptor = {
    type: "text",
    name: "Text",
    description: "A rich text field",
    render: (options:IContentTypeRenderOptions) => html`
        <hb-text-content
            .docUid=${options.docUid}
            .contentIndex=${options.contentIndex}
            .data=${options.data}
        ></hb-text-content>
    `
};

contentTypes.register("text", textContentType);