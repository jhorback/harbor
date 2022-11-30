var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Router } from "@domx/router";
import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { NotFoundError } from "../../domain/Errors";
export class ShowFileViewerEvent extends Event {
    constructor() {
        super(ShowFileViewerEvent.eventType);
    }
}
ShowFileViewerEvent.eventType = "show-file-viewer";
export class CloseFileViewerEvent extends Event {
    constructor() {
        super(CloseFileViewerEvent.eventType);
    }
}
CloseFileViewerEvent.eventType = "close-file-viewer";
export class NavigateFileViewerEvent extends Event {
    constructor(next) {
        super(NavigateFileViewerEvent.eventType);
        this.next = next;
        this.previous = !next;
    }
}
NavigateFileViewerEvent.eventType = "navigate-file-viewer";
export class FileViewerController extends StateController {
    constructor(host) {
        super(host);
        this.state = {
            files: new Array(),
            selectedFileName: undefined,
            selectedFile: undefined,
            canGoPrevious: false,
            canGoNext: false
        };
        this.host = host;
    }
    showFileViewer(event) {
        recordHistory();
        Product.of(this)
            .next(setInput(this.host))
            .next(setSelectedFileData)
            .next(setCanNavigate)
            .tap(updateUrlForSelectedFile)
            .requestUpdate("FileViewerController.hostConnected");
    }
    navigate(event) {
        Product.of(this)
            .next(setSelectedFileOnNavigate(event.next))
            .next(setSelectedFileData)
            .next(setCanNavigate)
            .tap(updateUrlForSelectedFile)
            .requestUpdate("FileViewerController.hostConnected");
    }
    closeFileViewer(event) {
        clearUrl();
    }
}
__decorate([
    stateProperty()
], FileViewerController.prototype, "state", void 0);
__decorate([
    hostEvent(ShowFileViewerEvent)
], FileViewerController.prototype, "showFileViewer", null);
__decorate([
    hostEvent(NavigateFileViewerEvent)
], FileViewerController.prototype, "navigate", null);
__decorate([
    hostEvent(CloseFileViewerEvent)
], FileViewerController.prototype, "closeFileViewer", null);
const setInput = (input) => (state) => {
    state.selectedFileName = input.fileName;
    state.files = input.files;
};
const setSelectedFileData = (state) => {
    const file = state.files.find(f => f.name === state.selectedFileName);
    if (!file) {
        throw new NotFoundError("File not found");
    }
    const isImage = file.type?.indexOf("image") === 0;
    const useMediaPreview = (file.type?.indexOf("audio") === 0 ||
        file.type?.indexOf("video") === 0) ? true : false;
    const canExtractPictureFile = (file.pictureUrl && !file.pictureFileName) ? true : false;
    state.selectedFile = {
        file,
        useMediaPreview,
        canExtractPictureFile,
        imagePreviewUrl: isImage ? file.url : file.pictureUrl || file.thumbUrl || file.defaultThumb
    };
};
const setCanNavigate = (state) => {
    const index = state.files.findIndex(f => f.name === state.selectedFileName);
    state.canGoPrevious = index > 0;
    state.canGoNext = index < state.files.length - 1;
};
const setSelectedFileOnNavigate = (next) => (state) => {
    const index = state.files.findIndex(f => f.name === state.selectedFileName);
    state.selectedFileName = next ? state.files[index + 1].name : state.files[index - 1].name;
};
const recordHistory = () => {
    history.pushState({}, '', window.location.href);
};
const updateUrlForSelectedFile = (product) => {
    const state = product.getState();
    state.selectedFileName && Router.replaceUrlParams({ fileName: state.selectedFileName });
};
const clearUrl = () => {
    Router.replaceUrlParams({ fileName: "" });
};
