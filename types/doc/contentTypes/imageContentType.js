import { contentTypes } from "../../domain/Doc/contentTypes";
import { html } from "lit-html";
export var ImageSize;
(function (ImageSize) {
    ImageSize["small"] = "small";
    ImageSize["medium"] = "medium";
    ImageSize["large"] = "large";
})(ImageSize || (ImageSize = {}));
export var ImageAlignment;
(function (ImageAlignment) {
    ImageAlignment["left"] = "left";
    ImageAlignment["center"] = "center";
    ImageAlignment["right"] = "right";
})(ImageAlignment || (ImageAlignment = {}));
export class ImageContentDataState {
    constructor() {
        this.contentType = "image";
        this.size = ImageSize.small;
        this.alignment = ImageAlignment.left;
        this.url = null;
        this.fileDbPath = null;
    }
    toPlainObject() {
        return {
            ...this
        };
    }
}
const imageContentType = {
    type: "image",
    name: "Image",
    description: "An image in the format of jpg, gif, png, etc.",
    render: (options) => html `
        <hb-image-content
            .docUid=${options.docUid}
            .contentIndex=${options.contentIndex}
            .data=${options.data}
        ></hb-image-content>
    `
};
contentTypes.register("image", imageContentType);
