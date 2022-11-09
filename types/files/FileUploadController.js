var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from "../domain/DependencyContainer/decorators";
import { ClientError } from "../domain/Errors";
import { FileType, FileUploadProgressEvent, UploadFilesRepoKey } from "../domain/interfaces/FileInterfaces";
import "../domain/Files/HbUploadFilesRepo";
import { convertPictureToBase64Src, extractMediaTags } from "../domain/Files/extractMediaTags";
import { StateController, stateProperty, hostEvent } from "@domx/statecontroller";
import { FileUploaderAccept, FileUploadCompleteEvent } from "./hb-file-upload-panel";
import { resizeImageFile } from "../domain/Files/resizeImageFile";
/**
 * The FileUploadController.state object
 */
export class FileUploadState {
    constructor() {
        this.uploadFileTypes = "files";
        this.onFile = 0;
        this.ofFile = 0;
        this.bytesTransferred = 0;
        this.totalBytes = 0;
        /** is true when at least 1 file requires overwrite */
        this.requiresOverwrite = false;
        /** the index of the a file that requires overwrite permission */
        this.requiresOverwriteFileIndex = -1;
        this.requiresOverwriteFileName = "";
        this.errors = new Array();
        this.skippedFiles = new Array();
        /** true when all work is done */
        this.isComplete = false;
        /**
         * The base64 string image source of a file that
         * requires overwrite permission or is not complete
         */
        this.highlightFileSrc = null;
    }
    get percentComplete() {
        return this.totalBytes === 0 ? 0 : Math.round((this.bytesTransferred / this.totalBytes) * 100);
    }
    ;
}
/** Host event to cancel the upload */
export class CancelUploadEvent extends Event {
    constructor() {
        super(CancelUploadEvent.eventType);
    }
    static { this.eventType = "cancel-upload"; }
}
/** Host event to allow overwriting a file */
export class OverwriteFileEvent extends Event {
    constructor(fileIndex, allowOverwrite) {
        super(OverwriteFileEvent.eventType);
        this.fileIndex = fileIndex;
        this.allowOverwrite = allowOverwrite;
    }
    static { this.eventType = "overwrite-file"; }
}
/**
 */
export class FileUploadController extends StateController {
    constructor(host) {
        super(host);
        this.state = new FileUploadState();
        this.uploads = new Array();
        this.host = host;
        this.fileInput = this.createFileInput(host.accept);
        this.fileUpdatedEventBus = this.createEventBus();
    }
    openFileSelector() {
        this.setFileInputAttributes();
        /** on change, calls: {@link onFileInputChange} */
        this.fileInput.click();
    }
    setFileInputAttributes() {
        const accept = this.host.accept;
        const multiple = this.host.multiple;
        // create the file input
        this.fileInput.setAttribute("type", "file");
        // set the accept attribute
        const acceptArray = new Array();
        if (accept === FileUploaderAccept.images) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.image);
        }
        else if (accept === FileUploaderAccept.audio) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.audio);
        }
        else if (accept === FileUploaderAccept.video) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.video);
        }
        else if (accept === FileUploaderAccept.media) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.audio);
            acceptArray.push(...this.filesRepo.supportedFileTypes.video);
        }
        else if (accept === FileUploaderAccept.all) {
            // accept all
        }
        else {
            throw new Error(`Invalid FileUploaderAccept value:${accept}`);
        }
        this.fileInput.setAttribute("accept", `.${acceptArray.join(", .")}`);
        // set the multiple attribute
        multiple && this.fileInput.setAttribute("multiple", "");
    }
    createFileInput(accept) {
        const input = document.createElement("input");
        // listen for change event
        input.addEventListener("change", this.onFileInputChange.bind(this));
        return input;
    }
    createEventBus() {
        const bus = new EventTarget();
        bus.addEventListener(FileUpdatedEvent.eventType, (event) => this.onFileUpdated(event));
        return bus;
    }
    onFileUpdated(event) {
        this.state = getNextState(this.host.accept, this.uploads);
        this.requestUpdate(event);
        if (this.state.isComplete) {
            this.dispatchCompletedEvent();
        }
    }
    dispatchCompletedEvent() {
        const uploadedFiles = new Array();
        this.uploads.forEach(file => {
            if (file.complete && file.error === null && file.uploadedFile !== null) {
                uploadedFiles.push(file.uploadedFile);
            }
        });
        this.host.dispatchEvent(new FileUploadCompleteEvent(uploadedFiles));
    }
    overwriteFile(event) {
        const fileData = this.uploads[event.fileIndex];
        // if allowing overwrite, retry
        if (event.allowOverwrite === true) {
            this.tryUpload(fileData, true);
            fileData.setNeedsAllowOverwritePermission(false);
            // otherwise cancel
        }
        else {
            fileData.setCancelled();
        }
    }
    cancelUpload(event) {
        this.uploads.forEach(file => file.cancelUpload());
    }
    async onFileInputChange(event) {
        const filesToUpload = await this.getFilesForUpload(this.fileInput.files);
        // try upload on all files from the file input
        filesToUpload.forEach(file => {
            const fileData = new FileState(this.fileUpdatedEventBus, file, this.filesRepo.getFileTypeFromExtension(file.name));
            this.uploads.push(fileData);
            this.tryUpload(fileData, false);
        });
        // show the panel
        this.host.showPanel();
    }
    /**
     * Takes the files to upload and resizes any images to their max size
     * before uploading.
     */
    async getFilesForUpload(files) {
        const promises = Array.from(files).map((file) => {
            const fileType = this.filesRepo.getFileTypeFromExtension(file.name);
            if (fileType === FileType.image) {
                return new Promise(async (resolve, reject) => {
                    try {
                        const resizeFile = await resizeImageFile(file, this.filesRepo.MAX_UPLOAD_SIZE);
                        resolve(resizeFile.resizeNeeded === true ? resizeFile.file : file);
                    }
                    catch (e) {
                        console.error("Error resizing image", e);
                        resolve(file);
                    }
                });
            }
            return Promise.resolve(file);
        });
        return await Promise.all(promises);
    }
    async tryUpload(fileData, allowOverwrite) {
        try {
            fileData.fileController.signal.addEventListener(FileUploadProgressEvent.eventType, (event) => fileData.updateProgress(event));
            const uploadedFile = await this.filesRepo.uploadFileWithProgress(fileData.file, {
                allowOverwrite,
                signal: fileData.fileController.signal
            });
            uploadedFile ? fileData.setComplete(uploadedFile) :
                fileData.setCancelled();
        }
        catch (error) {
            if (error instanceof ClientError && error.properties["reason"] === "exists") {
                fileData.setNeedsAllowOverwritePermission(true);
            }
            else {
                fileData.setCompleteWithError(error);
            }
        }
    }
}
__decorate([
    stateProperty()
], FileUploadController.prototype, "state", void 0);
__decorate([
    inject(UploadFilesRepoKey)
], FileUploadController.prototype, "filesRepo", void 0);
__decorate([
    hostEvent(OverwriteFileEvent)
], FileUploadController.prototype, "overwriteFile", null);
__decorate([
    hostEvent(CancelUploadEvent)
], FileUploadController.prototype, "cancelUpload", null);
const getNextState = (accept, uploads) => {
    const state = new FileUploadState();
    state.uploadFileTypes = accept;
    state.ofFile = uploads.length;
    let numberComplete = 0;
    uploads.forEach((file, index) => {
        // first, make sure to highlight the file if it requires overwrite
        if (file.needsAllowOverwritePermission && state.requiresOverwrite === false) {
            state.requiresOverwrite = true;
            state.requiresOverwriteFileIndex = index;
            state.requiresOverwriteFileName = file.name;
            state.highlightFileSrc = file.base64Src;
        }
        if (file.complete) {
            numberComplete = numberComplete + 1;
            if (file.cancelled) {
                state.skippedFiles.push(file.name);
            }
            // only set the highlight if we don't have one and the file is not complete
        }
        else if (state.highlightFileSrc === null) {
            state.highlightFileSrc = file.base64Src;
        }
        state.bytesTransferred = state.bytesTransferred + file.bytesTransferred;
        state.totalBytes = state.totalBytes + file.totalBytes;
        if (file.error) {
            state.skippedFiles.push(file.name);
            state.errors.push(new FileUploadError(file, file.error));
        }
    });
    // if we are not complete, set which file we are on
    if (numberComplete !== uploads.length) {
        state.onFile = uploads.length - numberComplete;
    }
    else {
        state.isComplete = true;
    }
    return state;
};
export class FileUploadError extends Error {
    constructor(fileState, cause) {
        super("File Upload Error");
        this.cause = cause;
        this.fileState = { ...fileState };
    }
}
/**
 * Used for tracking the progress of a single file
 */
class FileState {
    constructor(fileUpdatedEventBus, file, fileType) {
        this._uploadedFile = null;
        this.fileUpdatedEventBus = fileUpdatedEventBus;
        this._file = file;
        this._fileController = new AbortController();
        this._bytesTransferred = 0;
        this._totalBytes = 0;
        this._error = null;
        this._needsAllowOverwritePermission = false;
        this._complete = false;
        this._cancelled = false;
        this._base64Src = this.setBase64Src(fileType);
    }
    setBase64Src(fileType) {
        if (fileType === FileType.image) {
            return URL.createObjectURL(this._file);
        }
        this.tryExtractMediaThumb();
        return `/content/thumbs/${fileType}-thumb.svg`;
    }
    async tryExtractMediaThumb() {
        try {
            const tags = await extractMediaTags(this._file);
            if (tags.picture !== undefined) {
                this._base64Src = convertPictureToBase64Src(tags.picture);
            }
            this.dispatchUpdate();
        }
        catch (e) {
            console.log("Unable to pull media tags", e);
        }
    }
    get file() { return this._file; }
    get fileController() { return this._fileController; }
    get bytesTransferred() { return this._bytesTransferred; }
    get totalBytes() { return this._totalBytes; }
    get needsAllowOverwritePermission() { return this._needsAllowOverwritePermission; }
    get complete() { return this._complete; }
    get cancelled() { return this._cancelled; }
    get error() { return this._error; }
    get uploadedFile() { return this._uploadedFile; }
    get base64Src() { return this._base64Src; }
    get name() { return this._file.name; }
    cancelUpload() {
        this._fileController.abort();
    }
    setNeedsAllowOverwritePermission(allowOverwrite) {
        this._needsAllowOverwritePermission = allowOverwrite;
        this.dispatchUpdate();
    }
    updateProgress(progress) {
        this._bytesTransferred = progress.bytesTransferred;
        this._totalBytes = progress.totalBytes;
        this.dispatchUpdate();
    }
    setCompleteWithError(error) {
        this._error = error;
        this._complete = true;
        this._totalBytes = 0;
        this._bytesTransferred = 0;
        this.dispatchUpdate();
    }
    setComplete(uploadedFile) {
        this._uploadedFile = uploadedFile;
        this._complete = true;
        this._bytesTransferred = this._totalBytes;
        this.dispatchUpdate();
    }
    setCancelled() {
        this._complete = true;
        this._cancelled = true;
        this._totalBytes = 0;
        this._bytesTransferred = 0;
        this._needsAllowOverwritePermission = false;
        this.dispatchUpdate();
    }
    dispatchUpdate() {
        this.fileUpdatedEventBus.dispatchEvent(new FileUpdatedEvent());
    }
}
/**
 * Dispatched on the uploadController whenever
 * a file has state changes and causes
 * a recalculation of the {@link FileUploadState}
 */
class FileUpdatedEvent extends Event {
    constructor() {
        super(FileUpdatedEvent.eventType);
    }
    static { this.eventType = "file-updated"; }
}
