import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { NotFoundError } from "../../domain/Errors";
import { FileModel } from "../../domain/Files/FileModel";
import { FileViewer } from "./hb-file-viewer";



export interface IFileViewerState {
    selectedFileName: string|undefined;
    files: Array<FileModel>;
    selectedFile: IFilePreview|undefined;
    canGoPrevious: boolean;
    canGoNext: boolean;
}

interface IFilePreview {
    useMediaPreview:boolean;
    imagePreviewUrl:string;
    file:FileModel;
}


export class ShowFileViewerEvent extends Event {
    static eventType = "show-file-viewer"
    constructor() {
        super(ShowFileViewerEvent.eventType)
    }
}

export class NavigateFileViewerEvent extends Event {
    static eventType = "navigate-file-viewer";
    next:boolean;
    previous:boolean;
    constructor(next:boolean) {
        super(NavigateFileViewerEvent.eventType);
        this.next = next;
        this.previous = !next;
    }
}


export class FileViewerController extends StateController {


    @stateProperty()
    state:IFileViewerState = {
        files: new Array(),
        selectedFileName: undefined,
        selectedFile: undefined,
        canGoPrevious: false,
        canGoNext: false
    };

    host:FileViewer;

    constructor(host:FileViewer) {
        super(host);
        this.host = host;
    }


    @hostEvent(ShowFileViewerEvent)
    showFileViewer(event:ShowFileViewerEvent) {
        Product.of<IFileViewerState>(this)
            .next(setInput(this.host))
            .next(setSelectedFileData)
            .next(setCanNavigate)
            .requestUpdate("FileViewerController.hostConnected");
    }

    @hostEvent(NavigateFileViewerEvent)
    navigate(event:NavigateFileViewerEvent) {
        Product.of<IFileViewerState>(this)
            .next(setSelectedFileOnNavigate(event.next))
            .next(setSelectedFileData)
            .next(setCanNavigate)
            .requestUpdate("FileViewerController.hostConnected");
    }
}


const setInput = (input:FileViewer) => (state:IFileViewerState) => {
    state.selectedFileName = input.fileName;
    state.files = input.files;
};



const setSelectedFileData = (state:IFileViewerState) => {
    const file = state.files.find(f => f.name === state.selectedFileName);

    if (!file) {
        throw new NotFoundError("File not found");
    }

    const isImage = file.type?.indexOf("image") === 0;
    const useMediaPreview = (file.type?.indexOf("audio") === 0 || file.type?.indexOf("video")) ? true : false;

    state.selectedFile = {
        file,
        useMediaPreview,
        imagePreviewUrl: isImage ? file.url : file.thumbUrl || file.defaultThumb
    };

};


const setCanNavigate = (state:IFileViewerState) => {
    const index = state.files.findIndex(f => f.name === state.selectedFileName);
    state.canGoPrevious = index > 0;
    state.canGoNext = index < state.files.length - 1;
};


const setSelectedFileOnNavigate = (next:boolean) => (state:IFileViewerState) => {
    const index = state.files.findIndex(f => f.name === state.selectedFileName);
    state.selectedFileName = next ? state.files[index + 1].name : state.files[index - 1].name;
};
