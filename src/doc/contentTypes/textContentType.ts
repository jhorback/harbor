import { IContentType, IContentTypeDescriptor, IContentTypeRenderOptions } from "../../domain/interfaces/DocumentInterfaces";
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
    render: (options:IContentTypeRenderOptions) => html`
        <hb-text-content
            index=${options.index}
            .state=${options.state}
            ?edit-mode=${options.inEditMode}
        ></hb-text-content>
    `
};

contentTypes.register("text", textContentType);