import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { FindFileRepoKey, IFindFileRepo, IUploadedFile } from "../../../domain/interfaces/FileInterfaces";
import { PageThumbChangeEvent, UpdatePageContentEvent } from "../../hb-page";
import { ImageAlignment, ImageContentData, ImageSize } from "./imageContentType";
import { ImageContent } from "./hb-image-content";
import "../../../domain/Files/HbFindFileRepo";
import { FileModel } from "../../../domain/Files/FileModel";
import { PageContentController } from "../../hb-page/PageContentController";



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


export class ImageContentController extends PageContentController<ImageContentData> {

    state:ImageContentData = { ...this.content };

    stateUpdated() {
        this.state = { ...this.content };
    }

    @inject<IFindFileRepo>(FindFileRepoKey)
    private findFileRepo!:IFindFileRepo;

    @hostEvent(ImageSizeChangeEvent)
    imageSizeChange(event:ImageSizeChangeEvent) {  
        Product.of<ImageContentData>(this)
            .next(updateImageSize(event.size))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state));
    }

    @hostEvent(ImageAlignmentChangeEvent)
    imageAlignmentChange(event:ImageAlignmentChangeEvent) {
        Product.of<ImageContentData>(this)
            .next(updateImageAlignment(event.alignment))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state))
    }

    @hostEvent(ImageContentSelectedEvent)
    imageContentSelected(event:ImageContentSelectedEvent) {
        Product.of<ImageContentData>(this)
            .next(setImageContent(event.file))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state))
            .dispatchHostEvent(new PageThumbChangeEvent({
                thumbs: [event.file.thumbUrl as string]
            }));
    }

}


const syncWithDb = (controller:ImageContentController, findFileRepo:IFindFileRepo) => async (product:Product<ImageContentData>) => {
    const state = product.getState() as ImageContentData;

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


const updateImageSize = (size:ImageSize) => (state:ImageContentData) => {
    state.size = size;
};

const updateImageAlignment = (alignment:ImageAlignment) => (state:ImageContentData) => {
    state.alignment = alignment;
};

const setImageContent = (file:IUploadedFile) => (state:ImageContentData) => {
    state.fileDbPath = file.fileDbPath;
    state.url = file.url;
    state.thumbUrl = file.thumbUrl || null;
};

const updateImageUrl = (file:FileModel)=> (state:ImageContentData) => {
    state.url = file.url;
    state.thumbUrl = file.thumbUrl;
};