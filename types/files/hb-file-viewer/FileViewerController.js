var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Router } from "@domx/router";
import { hostEvent, Product, StateController, stateProperty } from "@domx/statecontroller";
import { inject } from "../../domain/DependencyContainer/decorators";
import { ServerError } from "../../domain/Errors";
import "../../domain/Files/HbEditFileRepo";
import { EditFileRepoKey } from "../../domain/interfaces/FileInterfaces";
import { sendFeedback } from "../../layout/feedback";
import { FileDeletedEvent } from "../hb-delete-file-dialog/DeleteFileController";
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
export class ExtractMediaPosterEvent extends Event {
    constructor() {
        super(ExtractMediaPosterEvent.eventType);
    }
}
ExtractMediaPosterEvent.eventType = "extract-media-poster";
export class UpdateMediaPosterEvent extends Event {
    constructor(file) {
        super(UpdateMediaPosterEvent.eventType);
        this.file = file;
    }
}
UpdateMediaPosterEvent.eventType = "update-media-poster";
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
    extractMediaPoster(event) {
        Product.of(this)
            .tap(extractMediaPoster(this.editFileRepo));
    }
    updateMediaPoster(event) {
        Product.of(this)
            .tap(updateMediaPoster(this.editFileRepo, event.file));
    }
    fileDeleted(event) {
        Product.of(this)
            .next(deleteSelectedFile)
            .next(setSelectedFileData)
            .next(setCanNavigate)
            .tap(updateUrlForSelectedFile)
            .tap(sendDeletedFileMessage)
            .requestUpdate("FileViewerController.hostConnected");
    }
}
__decorate([
    stateProperty()
], FileViewerController.prototype, "state", void 0);
__decorate([
    inject(EditFileRepoKey)
], FileViewerController.prototype, "editFileRepo", void 0);
__decorate([
    hostEvent(ShowFileViewerEvent)
], FileViewerController.prototype, "showFileViewer", null);
__decorate([
    hostEvent(NavigateFileViewerEvent)
], FileViewerController.prototype, "navigate", null);
__decorate([
    hostEvent(CloseFileViewerEvent)
], FileViewerController.prototype, "closeFileViewer", null);
__decorate([
    hostEvent(ExtractMediaPosterEvent)
], FileViewerController.prototype, "extractMediaPoster", null);
__decorate([
    hostEvent(UpdateMediaPosterEvent)
], FileViewerController.prototype, "updateMediaPoster", null);
__decorate([
    hostEvent(FileDeletedEvent)
], FileViewerController.prototype, "fileDeleted", null);
const setInput = (input) => (state) => {
    state.selectedFileName = input.fileName;
    state.files = input.files;
};
const setSelectedFileData = (state) => {
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
const extractMediaPoster = (editFileRepo) => async (product) => {
    const state = product.getState();
    if (!state.selectedFile) {
        throw new ServerError("File does not exist");
    }
    sendFeedback({ message: "Extracting picture file..." });
    const newFile = await editFileRepo.extractMediaPoster(state.selectedFile.file);
    product
        .next(setMediaPosterDbPath(newFile))
        .requestUpdate("FileViewerController.extractPictureFile");
    sendFeedback({ message: "The picture file has been extracted" });
};
const setMediaPosterDbPath = (file) => (state) => {
    if (state.selectedFile) {
        state.selectedFile.file.mediaPosterDbPath = file.storagePath;
    }
};
const updateMediaPoster = (editFileRepo, posterFile) => async (product) => {
    const state = product.getState();
    if (!state.selectedFile) {
        return;
    }
    const updatedFile = await editFileRepo.updateMediaPoster(state.selectedFile.file, posterFile);
    product
        .next(setSelectedFile(updatedFile))
        .next(setSelectedFileData)
        .requestUpdate("FileViewerController.updateMediaPoster");
    sendFeedback({ message: "The media poster has been updated" });
};
const setSelectedFile = (file) => (state) => {
    const index = state.files.findIndex(f => f.name === state.selectedFileName);
    state.files[index] = file;
};
const deleteSelectedFile = (state) => {
    const currentIndex = state.files.findIndex(f => f.name === state.selectedFileName);
    const nextIndex = state.canGoPrevious ? currentIndex - 1 : currentIndex + 1;
    state.selectedFileName = state.files[nextIndex].name;
    state.files.splice(currentIndex, 1);
};
const sendDeletedFileMessage = (product) => {
    sendFeedback({ message: "The file was deleted" });
};
