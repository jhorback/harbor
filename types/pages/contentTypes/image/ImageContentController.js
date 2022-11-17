var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { hostEvent, Product } from "@domx/statecontroller";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { FindFileRepoKey } from "../../../domain/interfaces/FileInterfaces";
import { UpdatePageContentEvent } from "../../hb-page";
import "../../../domain/Files/HbFindFileRepo";
import { PageContentController } from "../../hb-page/PageContentController";
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
export class ImageContentController extends PageContentController {
    constructor() {
        super(...arguments);
        this.state = { ...this.content };
    }
    stateUpdated() {
        this.state = { ...this.content };
    }
    imageSizeChange(event) {
        Product.of(this)
            .next(updateImageSize(event.size))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state));
    }
    imageAlignmentChange(event) {
        Product.of(this)
            .next(updateImageAlignment(event.alignment))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state));
    }
    imageContentSelected(event) {
        Product.of(this)
            .next(setImageContent(event.file))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state));
    }
}
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
    if (file.url !== state.url || file.thumbUrl !== state.thumbUrl) {
        product.next(updateImageUrl(file))
            .requestUpdate("ImageContentController.syncWithDb")
            .dispatchHostEvent(new UpdatePageContentEvent(controller.host.contentIndex, product.getState()));
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
    state.thumbUrl = file.thumbUrl || null;
};
const updateImageUrl = (file) => (state) => {
    state.url = file.url;
    state.thumbUrl = file.thumbUrl;
};
