import { Router } from "@domx/router";
import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { NotFoundError, ServerError } from "../../domain/Errors";
import { FileModel } from "../../domain/Files/FileModel";
import "../../domain/Files/HbEditFileRepo";
import { EditFileRepoKey, IEditFileRepo } from "../../domain/interfaces/FileInterfaces";
import { sendFeedback } from "../../layout/feedback";
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
    canExtractMediaPoster:boolean;
    canSetMediaPoster:boolean;
    file:FileModel;
}


export class ShowFileViewerEvent extends Event {
    static eventType = "show-file-viewer"
    constructor() {
        super(ShowFileViewerEvent.eventType)
    }
}

export class CloseFileViewerEvent extends Event {
    static eventType = "close-file-viewer"
    constructor() {
        super(CloseFileViewerEvent.eventType)
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


export class ExtractMediaPosterEvent extends Event {
    static eventType = "extract-media-poster"
    constructor() {
        super(ExtractMediaPosterEvent.eventType)
    }
}

export class UpdateMediaPosterEvent extends Event {
    static eventType = "update-media-poster"
    file:FileModel;
    constructor(file:FileModel) {
        super(UpdateMediaPosterEvent.eventType);
        this.file = file;
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

    @inject(EditFileRepoKey)
    editFileRepo!:IEditFileRepo;

    constructor(host:FileViewer) {
        super(host);
        this.host = host;
    }


    @hostEvent(ShowFileViewerEvent)
    showFileViewer(event:ShowFileViewerEvent) {
        recordHistory();
        Product.of<IFileViewerState>(this)
            .next(setInput(this.host))
            .next(setSelectedFileData)
            .next(setCanNavigate)
            .tap(updateUrlForSelectedFile)
            .requestUpdate("FileViewerController.hostConnected");
    }

    @hostEvent(NavigateFileViewerEvent)
    navigate(event:NavigateFileViewerEvent) {
        Product.of<IFileViewerState>(this)
            .next(setSelectedFileOnNavigate(event.next))
            .next(setSelectedFileData)
            .next(setCanNavigate)
            .tap(updateUrlForSelectedFile)
            .requestUpdate("FileViewerController.hostConnected");
    }

    @hostEvent(CloseFileViewerEvent)
    closeFileViewer(event:CloseFileViewerEvent) {
        clearUrl();
    }

    @hostEvent(ExtractMediaPosterEvent)
    extractMediaPoster(event:ExtractMediaPosterEvent) {
        Product.of<IFileViewerState>(this)
            .tap(extractMediaPoster(this.editFileRepo));
    }

    @hostEvent(UpdateMediaPosterEvent)
    updateMediaPoster(event:UpdateMediaPosterEvent) {
        Product.of<IFileViewerState>(this)
            .tap(updateMediaPoster(this.editFileRepo, event.file));
    }
}


const setInput = (input:FileViewer) => (state:IFileViewerState) => {
    state.selectedFileName = input.fileName;
    state.files = input.files;
};



const setSelectedFileData = (state:IFileViewerState) => {
    const file = state.files.find(f => f.name === state.selectedFileName);
    if (!file) {
       console.warn(`File not found: ${state.selectedFileName}`);
       return;
    }

    const isImage = file.type?.indexOf("image") === 0;
    const useMediaPreview = (file.type?.indexOf("audio") === 0 ||
        file.type?.indexOf("video") === 0) ? true : false;
    const canExtractPictureFile = (file.mediaPosterUrl && !file.mediaPosterDbPath) ? true : false;
    const canSetMediaPoster = !isImage;

    state.selectedFile = {
        file,
        useMediaPreview,
        canExtractMediaPoster: canExtractPictureFile,
        canSetMediaPoster,
        imagePreviewUrl: isImage ? file.url : file.mediaPosterUrl || file.thumbUrl || file.defaultThumb
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


const recordHistory = () => {
    history.pushState({}, '', window.location.href);
};


const updateUrlForSelectedFile = (product:Product<IFileViewerState>) => {
    const state = product.getState();
    state.selectedFileName && Router.replaceUrlParams({fileName: state.selectedFileName});
};

const clearUrl = () => {
    Router.replaceUrlParams({fileName: ""});
};



const extractMediaPoster = (editFileRepo:IEditFileRepo) => async (product:Product<IFileViewerState>) => {
    const state = product.getState();
    if (!state.selectedFile) {
        throw new ServerError("File does not exist");
    }

    sendFeedback({message: "Extracting picture file..."});
    const newFile = await editFileRepo.extractMediaPoster(state.selectedFile.file);
    product
        .next(setMediaPosterDbPath(newFile))
        .requestUpdate("FileViewerController.extractPictureFile");

    sendFeedback({message: "The picture file has been extracted"});
};


const setMediaPosterDbPath = (file:FileModel) => (state:IFileViewerState) => {
    if (state.selectedFile) {
        state.selectedFile.file.mediaPosterDbPath = file.storagePath;
    }
};


const updateMediaPoster = (editFileRepo:IEditFileRepo, posterFile:FileModel) =>
    async (product:Product<IFileViewerState>) => {
        const state = product.getState();
        if (!state.selectedFile) {
            return;
        }

        const updatedFile = await editFileRepo.updateMediaPoster(state.selectedFile.file, posterFile);
        product
            .next(setSelectedFile(updatedFile))
            .next(setSelectedFileData)
            .requestUpdate("FileViewerController.updateMediaPoster");

        sendFeedback({message:"The media poster has been updated"});
};


const setSelectedFile = (file:FileModel) => (state:IFileViewerState) => {
    const index = state.files.findIndex(f => f.name === state.selectedFileName);
    state.files[index] = file;
};