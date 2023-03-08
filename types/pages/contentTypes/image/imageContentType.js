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
export class ImageContentData {
    constructor() {
        this.uid = contentTypes.newUId();
        this.contentType = "image";
        this.size = ImageSize.small;
        this.alignment = ImageAlignment.center;
        this.url = null;
        this.thumbUrl = null;
        this.fileDbPath = null;
    }
}
export const DEFAULT_IMAGE_URL = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAMFBMVEXp7vG6vsG3u77s8fTCxsnn7O/f5OfFyczP09bM0dO8wMPk6ezY3eDd4uXR1tnJzdBvAX/cAAACVElEQVR4nO3b23KDIBRA0ShGU0n0//+2KmO94gWZ8Zxmr7fmwWEHJsJUHw8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO1MHHdn+L3rIoK6eshsNJ8kTaJI07fERPOO1Nc1vgQm2oiBTWJ+d8+CqV1heplLzMRNonED+4mg7L6p591FC+133/xCRNCtd3nL9BlxWP++MOaXFdEXFjZ7r8D9l45C8y6aG0cWtP/SUGhs2d8dA/ZfGgrzYX+TVqcTNRRO9l+fS5eSYzQs85psUcuzk6igcLoHPz2J8gvzWaH/JLS+95RfOD8o1p5CU5R7l5LkfKEp0mQ1UX7hsVXqDpRrifILD/3S9CfmlUQFhQfuFu0STTyJ8gsP3PH7GVxN1FC4t2sbBy4TNRTu7LyHJbqaqKFw+/Q0ncFloo7CjRPwMnCWqKXQZ75El4nKC9dmcJaou9AXOE5UXbi+RGeJygrz8Uf+GewSn9uXuplnWDZJ7d8f24F/s6iq0LYf9olbS3Q8i5oKrRu4S9ybwaQ/aCkqtP3I28QDgeoK7TBya/aXqL5COx67PTCD2grtdOwH+pQV2r0a7YVBgZoKwwIVFQYG6ikMDVRTGByopjD8ATcKb0UhhRTe77sKs2DV7FKSjId18TUEBYVyLhUThWfILHTDqmI85/2RWWjcE/bhP6OD7maT3h20MHsA47JC3PsW0wcwLhv9t0OOPOIkCn21y2bXXwlyylxiYMPk1SuCSmpfK8bNQvIrpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwNX4BCbAju9/X67UAAAAASUVORK5CYII=";
const imageContentType = {
    type: "image",
    name: "Image",
    description: "An image in the format of jpg, gif, png, etc.",
    icon: "image",
    defaultData: new ImageContentData(),
    render: (options) => html `
        <hb-image-content
            pathname=${options.pathname}
            content-index=${options.contentIndex}
        ></hb-image-content>
    `
};
contentTypes.register("image", imageContentType);
