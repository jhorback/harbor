import { IContentType, IContentTypeDescriptor } from "../../interfaces/DocumentInterfaces";
import { contentTypes } from "./contentTypes";


export class ImageContentData implements IContentType {
    contentType = "image";
}

const imageContentType:IContentTypeDescriptor = {
    type: "image",
    name: "Image",
    description: "An image in the format of jpg, gif, png, etc.",
    element: "hb-image-content"
};

contentTypes.register("image", imageContentType);