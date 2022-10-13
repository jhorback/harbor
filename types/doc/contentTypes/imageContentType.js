import { contentTypes } from "../../domain/Doc/contentTypes";
export class ImageContentData {
    constructor() {
        this.contentType = "image";
    }
}
const imageContentType = {
    type: "image",
    name: "Image",
    description: "An image in the format of jpg, gif, png, etc.",
    render: (state) => { throw new Error("Not Implemented"); }
    /*html`<hb-image-content .state=${state}></hb-image-content>`*/
};
contentTypes.register("image", imageContentType);
