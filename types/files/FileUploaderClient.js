var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from "../domain/DependencyContainer/decorators";
import { ClientError } from "../domain/Errors";
import { FileUploadType, FileUploadCompletedEvent, FileUploadProgressEvent, UploadFilesRepoKey } from "../domain/interfaces/FileInterfaces";
import "../domain/Files/HbUploadFilesRepo";
import { convertPictureToBase64Src, extractMediaTags } from "../domain/Files/extractMediaTags";
import { UploadStatusPanel } from "./hb-upload-status-panel";
export var FileUploaderAccept;
(function (FileUploaderAccept) {
    FileUploaderAccept["images"] = "images";
    FileUploaderAccept["audio"] = "audio";
    FileUploaderAccept["video"] = "video";
    FileUploaderAccept["media"] = "media";
})(FileUploaderAccept || (FileUploaderAccept = {}));
/**
 * Opens the file browser and uploads a file.
 *
 * Usage:
 * ```js
 * const uploader = new FileUploaderClient({accept: FileUploaderAccept.audio});
 * uploader.onComplete((event:FileUploadCompletedEvent) => {});
 * uploader.handleFileUpload();
 * ```
 */
export class FileUploaderClient {
    constructor(options) {
        this.uploads = new Array();
        if (options.multiple === true) {
            throw new Error("Not Implemented");
        }
        this.acceptOption = options.accept;
        this.fileInput = this.createFileInput(options.accept);
        this.uploadController = this.initializeUploadController();
        this.statusPanel = document.createElement("hb-upload-status-panel");
    }
    handleFileUpload() {
        this.fileInput.click();
    }
    onComplete(eventHandler) {
        this.uploadController.signal.addEventListener(FileUploadCompletedEvent.eventType, (event) => eventHandler(event));
    }
    createFileInput(accept) {
        // create the input
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        // set the accept attribute
        const acceptArray = new Array();
        if (accept === FileUploaderAccept.images) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.images);
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
        else {
            throw new Error(`Invalid FileUploaderAccept value:${accept}`);
        }
        input.setAttribute("accept", `.${acceptArray.join(", .")}`);
        // listen for change event
        input.addEventListener("change", this.onFileInputChange.bind(this));
        return input;
    }
    initializeUploadController() {
        const controller = new AbortController();
        controller.signal.addEventListener(FileUpdatedEvent.eventType, (event) => this.onFileUpdated(event));
        return controller;
    }
    onFileUpdated(event) {
        const state = new FileUploadStatusData();
        state.uploadFileTypes = this.acceptOption;
        state.ofFile = this.uploads.length;
        let numberComplete = 0;
        this.uploads.forEach((file, index) => {
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
        if (numberComplete !== this.uploads.length) {
            state.onFile = this.uploads.length - numberComplete;
            // if we are complete check for errors and dispatch the completed event
        }
        else {
            state.isComplete = true;
            this.dispatchCompletedEvent();
        }
        // update the status panel UI element state
        this.statusPanel.state = state;
    }
    dispatchCompletedEvent() {
        const uploadedFiles = new Array();
        this.uploads.forEach(file => {
            if (file.complete && file.error === null && file.uploadedFile !== null) {
                uploadedFiles.push(file.uploadedFile);
            }
        });
        this.uploadController.signal.dispatchEvent(new FileUploadCompletedEvent(uploadedFiles));
    }
    onFileInputChange(event) {
        // add the status panel and hook up the events
        this.statusPanel = UploadStatusPanel.open();
        // handle allowing overwrite on a file
        this.statusPanel.addEventListener(OverwriteFileEvent.eventType, (event) => {
            const overwriteEvent = event;
            const fileData = this.uploads[overwriteEvent.fileIndex];
            // if allowing overwrite, retry
            if (overwriteEvent.allowOverwrite === true) {
                this.tryUpload(fileData, true);
                fileData.setNeedsAllowOverwritePermission(false);
                // otherwise cancel
            }
            else {
                fileData.setCancelled();
            }
        });
        // handle cancelling the upload
        this.statusPanel.addEventListener(CancelUploadEvent.eventType, (event) => {
            const cancelEvent = event;
            this.uploads.forEach(file => file.cancelUpload());
        });
        // try upload on all files from the file input
        Array.from(this.fileInput.files).forEach(file => {
            const fileData = new UploadFileState(this.uploadController, file, this.filesRepo.getFileTypeFromExtension(file.name));
            this.uploads.push(fileData);
            this.tryUpload(fileData, false);
        });
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
    inject(UploadFilesRepoKey)
], FileUploaderClient.prototype, "filesRepo", void 0);
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
class UploadFileState {
    constructor(uploadController, file, fileType) {
        this._uploadedFile = null;
        this._uploadController = uploadController;
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
        if (fileType === FileUploadType.images) {
            return URL.createObjectURL(this._file);
        }
        this.tryExtractMediaThumb();
        return `/content/thumbs/${fileType}-thumb.svg`;
    }
    async tryExtractMediaThumb() {
        try {
            const tags = await extractMediaTags(this._file);
            this._base64Src = convertPictureToBase64Src(tags.picture);
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
        this._uploadController.signal.dispatchEvent(new FileUpdatedEvent());
    }
}
/**
 * Dispatched on the uploadController whenever
 * a file has state changes and causes
 * a recalculation of the {@link FileUploadStatusData}
 */
class FileUpdatedEvent extends Event {
    constructor() {
        super(FileUpdatedEvent.eventType);
    }
}
FileUpdatedEvent.eventType = "file-updated";
/**
 * Used to communicate the overall status
 * of all uploads
 */
export class FileUploadStatusData {
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
/**
 * DOM event for status-panel
 */
export class CancelUploadEvent extends Event {
    constructor() {
        super(CancelUploadEvent.eventType, { bubbles: true, composed: true });
    }
}
CancelUploadEvent.eventType = "cancel-upload";
/**
 * DOM event for status-panel
 */
export class OverwriteFileEvent extends Event {
    constructor(fileIndex, allowOverwrite) {
        super(OverwriteFileEvent.eventType, { bubbles: true, composed: true });
        this.fileIndex = fileIndex;
        this.allowOverwrite = allowOverwrite;
    }
}
OverwriteFileEvent.eventType = "overwrite-file";
