import { contentTypes } from "../../domain/Doc/contentTypes";
import { html } from "lit-html";
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
    render: (options) => html `
        <hb-text-content
            .contentIndex=${options.contentIndex}
            .state=${options.state}
        ></hb-text-content>
    `
};
contentTypes.register("text", textContentType);
