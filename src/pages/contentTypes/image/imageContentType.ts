import { html } from "lit-html";
import { IContentType, IContentTypeDescriptor, IContentTypeRenderOptions } from "../../../domain/interfaces/PageInterfaces";
import { contentTypes } from "../../../domain/Pages/contentTypes";


export enum ImageSize {
    small = "small",
    medium = "medium",
    large = "large"
}

export enum ImageAlignment {
    left = "left",
    center = "center",
    right = "right"
}

export class ImageContentDataState implements IContentType {
    contentType = "image";
    size:ImageSize = ImageSize.small;
    alignment:ImageAlignment = ImageAlignment.left;
    url:string|null = null;
    thumbUrl:string|null = null;
    fileDbPath:string|null = null;
    toPlainObject():ImageContentDataState {
        return {
            ...this
        } as ImageContentDataState;
    }
}


const imageContentType:IContentTypeDescriptor = {
    type: "image",
    name: "Image",
    description: "An image in the format of jpg, gif, png, etc.",
    render: (options:IContentTypeRenderOptions) => html`
        <hb-image-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-image-content>
    `
};

contentTypes.register("image", imageContentType);