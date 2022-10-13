import { IContentType, IContentTypeDescriptor } from "../../domain/interfaces/DocumentInterfaces";
import { contentTypes } from "../../domain/Doc/contentTypes";
import { html } from "lit-html";


export class ImageContentData implements IContentType {
    contentType = "image";
}

const imageContentType:IContentTypeDescriptor = {
    type: "image",
    name: "Image",
    description: "An image in the format of jpg, gif, png, etc.",
    render: (state:IContentType) => { throw new Error("Not Implemented"); }
    /*html`<hb-image-content .state=${state}></hb-image-content>`*/
};

contentTypes.register("image", imageContentType);