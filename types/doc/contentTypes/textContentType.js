import { contentTypes } from "../../domain/Doc/contentTypes";
import { html } from "lit-html";
export class TextContentData {
    constructor() {
        this.contentType = "text";
        this.text = "";
    }
}
const textContentType = {
    type: "text",
    name: "Text",
    description: "A rich text field",
    render: (state) => html `<hb-text-content .state=${state}></hb-text-content>`
};
contentTypes.register("text", textContentType);
