import { contentTypes } from "./contentTypes";
export class ImageContentData {
    constructor() {
        this.contentType = "image";
    }
}
const imageContentType = {
    type: "image",
    name: "Image",
    description: "An image in the format of jpg, gif, png, etc.",
    element: "hb-image-content"
};
contentTypes.register("image", imageContentType);
