import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { FindFileRepoKey, IFindFileRepo } from "../../../domain/interfaces/FileInterfaces";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { ImageAlignment, ImageContentDataState, ImageSize } from "../imageContentType";


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
}

const updateImageSize = (size:ImageSize) => (state:ImageContentDataState) => {
    state.size = size;
};

const updateImageAlignment = (alignment:ImageAlignment) => (state:ImageContentDataState) => {
    state.alignment = alignment;
};
