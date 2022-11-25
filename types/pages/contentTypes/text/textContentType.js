import { html } from "lit-html";
import { contentTypes } from "../../../domain/Pages/contentTypes";
export class TextContentData {
    constructor() {
        this.contentType = "text";
        this.text = "";
    }
    static of(text) {
        const data = new TextContentData();
        data.text = text;
        return data;
    }
}
const textContentType = {
    type: "text",
    name: "Text",
    description: "A rich text field",
    icon: "description",
    defaultData: new TextContentData(),
    render: (options) => html `
        <hb-text-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-text-content>
    `
};
contentTypes.register("text", textContentType);
