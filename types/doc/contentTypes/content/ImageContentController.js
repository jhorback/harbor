var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
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
export class ImageContentController extends StateController {
    constructor(host) {
        super(host);
        this.state = new ImageContentDataState();
        this.host = host;
    }
    hostConnected() {
        super.hostConnected();
        this.state = this.host.data;
        Product.of(this, "state")
            .tap(syncWithDb(this, this.findFileRepo));
    }
    imageSizeChange(event) {
        Product.of(this, "state")
            .next(updateImageSize(event.size))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdateDocContentEvent(this.contentIndex, this.state));
    }
    imageAlignmentChange(event) {
        Product.of(this, "state")
            .next(updateImageAlignment(event.alignment))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdateDocContentEvent(this.contentIndex, this.state));
    }
    imageContentSelected(event) {
        Product.of(this, "state")
            .next(setImageContent(event.file))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdateDocContentEvent(this.contentIndex, this.state));
    }
}
__decorate([
    stateProperty()
], ImageContentController.prototype, "state", void 0);
__decorate([
    inject(FindFileRepoKey)
], ImageContentController.prototype, "findFileRepo", void 0);
__decorate([
    hostEvent(ImageSizeChangeEvent)
], ImageContentController.prototype, "imageSizeChange", null);
__decorate([
    hostEvent(ImageAlignmentChangeEvent)
], ImageContentController.prototype, "imageAlignmentChange", null);
__decorate([
    hostEvent(ImageContentSelectedEvent)
], ImageContentController.prototype, "imageContentSelected", null);
const syncWithDb = (controller, findFileRepo) => async (product) => {
    const state = product.getState();
    if (!state.fileDbPath) {
        return;
    }
    const file = await findFileRepo.findFile(state.fileDbPath);
    if (!file) {
        return;
    }
    if (file.url !== state.url) {
        product.next(updateImageUrl(file.url))
            .requestUpdate("ImageContentController.syncWithDb")
            .dispatchHostEvent(new UpdateDocContentEvent(controller.host.contentIndex, product.getState()));
    }
};
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
const updateImageUrl = (url) => (state) => {
    state.url = url;
};
