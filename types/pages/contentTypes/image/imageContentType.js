import { html } from "lit-html";
import { contentTypes } from "../../../domain/Pages/contentTypes";
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
        this.thumbUrl = null;
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
            .pathname=${options.pathname}
            .contentIndex=${options.contentIndex}
            .data=${options.data}
        ></hb-image-content>
    `
};
contentTypes.register("image", imageContentType);
