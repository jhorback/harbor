import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { FindFileRepoKey, IFindFileRepo, IUploadedFile } from "../../../domain/interfaces/FileInterfaces";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { ImageAlignment, ImageContentDataState, ImageSize } from "../imageContentType";
import { ImageContent } from "./hb-image-content";
import "../../../domain/Files/HbFindFileRepo";
import { FileModel } from "../../../domain/Files/FileModel";



export class ImageSizeChangeEvent extends Event {
    static eventType = "image-size-change";
    size:ImageSize;
    constructor(size:ImageSize) {
        super(ImageSizeChangeEvent.eventType);
        this.size = size;
    }
}

export class ImageAlignmentChangeEvent extends Event {
    static eventType = "image-alignment-change";
    alignment:ImageAlignment;
    constructor(alignment:ImageAlignment) {
        super(ImageAlignmentChangeEvent.eventType);
        this.alignment = alignment;
    }
}

export class ImageContentSelectedEvent extends Event {
    static eventType = "image-content-selected";
    file:IUploadedFile;
    constructor(file:IUploadedFile) {
        super(ImageContentSelectedEvent.eventType);
        this.file = file;
    }
}


export class ImageContentController extends StateController {

    @stateProperty()
    state:ImageContentDataState = new ImageContentDataState();

    host:ImageContent;

    constructor(host:ImageContent) {
        super(host);
        this.host = host;
    }

    hostConnected() {
        super.hostConnected();
        this.state = this.host.data;
        Product.of<ImageContentDataState>(this, "state")
            .tap(syncWithDb(this, this.findFileRepo));
    }

    @inject<IFindFileRepo>(FindFileRepoKey)
    private findFileRepo!:IFindFileRepo;

    @hostEvent(ImageSizeChangeEvent)
    imageSizeChange(event:ImageSizeChangeEvent) {
        Product.of<ImageContentDataState>(this, "state")
            .next(updateImageSize(event.size))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdateDocContentEvent(this.host.contentIndex, this.state))
    }

    @hostEvent(ImageAlignmentChangeEvent)
    imageAlignmentChange(event:ImageAlignmentChangeEvent) {
        Product.of<ImageContentDataState>(this, "state")
            .next(updateImageAlignment(event.alignment))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdateDocContentEvent(this.host.contentIndex, this.state))
    }

    @hostEvent(ImageContentSelectedEvent)
    imageContentSelected(event:ImageContentSelectedEvent) {
        Product.of<ImageContentDataState>(this, "state")
            .next(setImageContent(event.file))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdateDocContentEvent(this.host.contentIndex, this.state));
    }

}


const syncWithDb = (controller:ImageContentController, findFileRepo:IFindFileRepo) => async (product:Product<ImageContentDataState>) => {
    const state = product.getState() as ImageContentDataState;

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
            .dispatchHostEvent(new UpdateDocContentEvent(controller.host.contentIndex, product.getState()));
    }
};


const updateImageSize = (size:ImageSize) => (state:ImageContentDataState) => {
    state.size = size;
};

const updateImageAlignment = (alignment:ImageAlignment) => (state:ImageContentDataState) => {
    state.alignment = alignment;
};

const setImageContent = (file:IUploadedFile) => (state:ImageContentDataState) => {
    state.fileDbPath = file.fileDbPath;
    state.url = file.url;
    state.thumbUrl = file.thumbUrl || null;
};

const updateImageUrl = (file:FileModel)=> (state:ImageContentDataState) => {
    state.url = file.url;
    state.thumbUrl = file.thumbUrl;
};