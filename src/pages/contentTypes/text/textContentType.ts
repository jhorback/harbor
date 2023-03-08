import { html } from "lit-html";
import { IContentType, IContentTypeDescriptor, IContentTypeRenderOptions } from "../../../domain/interfaces/PageInterfaces";
import { contentTypes } from "../../../domain/Pages/contentTypes";


export class TextContentData implements IContentType {
    static of(text:string):TextContentData {
        const data = new TextContentData();
        data.text = text;
        return data;
    }
    uid = contentTypes.newUId();
    contentType = "text";
    text = "";
}

const textContentType:IContentTypeDescriptor = {
    type: "text",
    name: "Text",
    description: "A rich text field",
    icon: "description",
    defaultData: new TextContentData(),
    render: (options:IContentTypeRenderOptions) => html`
        <hb-text-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-text-content>
    `
};

contentTypes.register("text", textContentType);