import { IContentType, IContentTypeDescriptor } from "../../domain/interfaces/DocumentInterfaces";
import { contentTypes } from "../../domain/Doc/contentTypes";


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