var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ImageContentData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { FindFileRepoKey } from "../../../domain/interfaces/FileInterfaces";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { ImageContentDataState } from "../imageContentType";
export class ImageSizeChangeEvent extends Event {
    constructor(size) {
        super(ImageSizeChangeEvent.eventType);
        this.size = size;
    }
}
ImageSizeChangeEvent.eventType = "image-size-change";
export class ImageAlignmentChangeEvent extends Event {
    constructor(alignment) {
        super(ImageAlignmentChangeEvent.eventType);
        this.alignment = alignment;
    }
}
ImageAlignmentChangeEvent.eventType = "image-alignment-change";
export class ImageContentSelectedEvent extends Event {
    constructor(file) {
        super(ImageContentSelectedEvent.eventType);
        this.file = file;
    }
}
ImageContentSelectedEvent.eventType = "image-content-selected";
let ImageContentData = ImageContentData_1 = class ImageContentData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = ImageContentData_1.defaultState;
    }
    get uid() { return this.getAttribute("uid") || ""; }
    get contentIndex() {
        const index = this.getAttribute("content-index");
        return index ? parseInt(index) : -1;
    }
    imageSizeChange(event) {
        StateChange.of(this)
            .next(updateImageSize(event.size))
            .dispatch()
            .dispatchEvent(new UpdateDocContentEvent(this.contentIndex, this.state));
    }
    imageAlignmentChange(event) {
        StateChange.of(this)
            .next(updateImageAlignment(event.alignment))
            .dispatch()
            .dispatchEvent(new UpdateDocContentEvent(this.contentIndex, this.state));
    }
    imageContentSelected(event) {
        StateChange.of(this)
            .next(setImageContent(event.file))
            .dispatch()
            .dispatchEvent(new UpdateDocContentEvent(this.contentIndex, this.state));
    }
};
ImageContentData.defaultState = new ImageContentDataState().toPlainObject();
__decorate([
    dataProperty()
], ImageContentData.prototype, "state", void 0);
__decorate([
    inject(FindFileRepoKey)
], ImageContentData.prototype, "findFileRepo", void 0);
__decorate([
    event(ImageSizeChangeEvent.eventType)
], ImageContentData.prototype, "imageSizeChange", null);
__decorate([
    event(ImageAlignmentChangeEvent.eventType)
], ImageContentData.prototype, "imageAlignmentChange", null);
__decorate([
    event(ImageContentSelectedEvent.eventType)
], ImageContentData.prototype, "imageContentSelected", null);
ImageContentData = ImageContentData_1 = __decorate([
    customDataElement("hb-image-content-data", {
        eventsListenAt: "self",
        stateIdProperty: "uid"
    })
], ImageContentData);
export { ImageContentData };
const updateImageSize = (size) => (state) => {
    state.size = size;
};
const updateImageAlignment = (alignment) => (state) => {
    state.alignment = alignment;
};
const setImageContent = (file) => (state) => {
    state.fileDbPath = file.fileDbPath;
    state.url = file.url;
};
