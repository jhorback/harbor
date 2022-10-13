import { contentTypes } from "./contentTypes";
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
    element: "hb-text-content"
};
contentTypes.register("text", textContentType);
