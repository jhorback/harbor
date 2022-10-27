import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { FindFileRepoKey, IFindFileRepo, IUploadedFile } from "../../../domain/interfaces/FileInterfaces";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { ImageAlignment, ImageContentDataState, ImageSize } from "../imageContentType";
import "../../../domain/Files/HbFindFileRepo";


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


@customDataElement("hb-image-content-data", {
    eventsListenAt: "self",
    stateIdProperty: "uid"
})
export class ImageContentData extends DataElement {
    static defaultState:ImageContentDataState = new ImageContentDataState().toPlainObject();

    get uid():string { return this.getAttribute("uid") || ""; }
    get contentIndex():number {
        const index = this.getAttribute("content-index");
        return index ? parseInt(index) : -1;
    }
    
    @dataProperty()
    state = ImageContentData.defaultState;

    @inject<IFindFileRepo>(FindFileRepoKey)
    private findFileRepo!:IFindFileRepo;

    connectedCallback() {
        super.connectedCallback();
        StateChange.of(this)
            .tap(syncWithDb(this, this.findFileRepo));
    }

    @event(ImageSizeChangeEvent.eventType)
    imageSizeChange(event:ImageSizeChangeEvent) {
        StateChange.of(this)
            .next(updateImageSize(event.size))
            .dispatch()
            .dispatchEvent(new UpdateDocContentEvent(this.contentIndex, this.state))
    }

    @event(ImageAlignmentChangeEvent.eventType)
    imageAlignmentChange(event:ImageAlignmentChangeEvent) {
        StateChange.of(this)
            .next(updateImageAlignment(event.alignment))
            .dispatch()
            .dispatchEvent(new UpdateDocContentEvent(this.contentIndex, this.state))
    }

    @event(ImageContentSelectedEvent.eventType)
    imageContentSelected(event:ImageContentSelectedEvent) {
        StateChange.of(this)
            .next(setImageContent(event.file))
            .dispatch()
            .dispatchEvent(new UpdateDocContentEvent(this.contentIndex, this.state));
    }
}

const syncWithDb = (dataEl:ImageContentData, findFileRepo:IFindFileRepo) => async (stateChange:StateChange) => {
    const state = stateChange.getState() as ImageContentDataState;
    if (!state.fileDbPath) {
        return;
    }

    const file = await findFileRepo.findFile(state.fileDbPath);
    if (!file) {
        return;
    }

    if (file.url !== state.url) {
        stateChange.next(updateImageUrl(file.url))
            .dispatch()
            .dispatchEvent(new UpdateDocContentEvent(dataEl.contentIndex, dataEl.state));
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
};

const updateImageUrl = (url:string)=> (state:ImageContentDataState) => {
    state.url = url;
};