import { inject } from "../domain/DependencyContainer/decorators";
import { ClientError } from "../domain/Errors";
import { FileUploadCompletedEvent, FileUploadProgressEvent, IUploadedFile, IUploadFileOptions, IUploadFilesRepo, UploadFilesRepoKey } from "../domain/interfaces/FileInterfaces";
import "../domain/Files/HbUploadFilesRepo";
import { UploadStatusPanel } from "./hb-upload-status-panel";


export enum FileUploaderAccept {
    images = "images",
    audio = "audio",
    video = "video",
    media = "media"
}

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

    @inject(UploadFilesRepoKey)
    private filesRepo!:IUploadFilesRepo;

    private fileInput:HTMLInputElement;

    private uploadController:AbortController;

    private statusPanel:UploadStatusPanel;

    private acceptOption:FileUploaderAccept;

    constructor(options:IFileUploaderClientOptions) {
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

    public onComplete(eventHandler:(event:FileUploadCompletedEvent) => void) {
        this.uploadController.signal.addEventListener(FileUploadCompletedEvent.eventType,
            (event:Event) => eventHandler(event as FileUploadCompletedEvent))
    }

    private createFileInput(accept:FileUploaderAccept):HTMLInputElement {

        // create the input
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        
        // set the accept attribute
        const acceptArray = new Array();
        if (accept === FileUploaderAccept.images) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.images);
        } else if (accept === FileUploaderAccept.audio) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.audio);
        } else if (accept === FileUploaderAccept.video) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.video);
        } else if (accept === FileUploaderAccept.media) {
            acceptArray.push(...this.filesRepo.supportedFileTypes.audio);
            acceptArray.push(...this.filesRepo.supportedFileTypes.video);
        } else {
            throw new Error(`Invalid FileUploaderAccept value:${accept}`);
        }
        input.setAttribute("accept", `.${acceptArray.join(", .")}`);

        // listen for change event
        input.addEventListener("change", this.onFileInputChange.bind(this));
        return input;
    }

    private initializeUploadController():AbortController {
        const controller = new AbortController();
        controller.signal.addEventListener(FileUpdatedEvent.eventType, (event:Event) =>
            this.onFileUpdated(event as FileUploadCompletedEvent));
        return controller;
    }

    private onFileUpdated(event:FileUploadCompletedEvent) {
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
            } else if (state.highlightFileSrc === null) {
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
        } else {
            state.isComplete = true;
            this.dispatchCompletedEvent();
        }

        // update the status panel UI element state
        this.statusPanel.state = state;
    }

    private dispatchCompletedEvent() {
        const uploadedFiles = new Array<IUploadedFile>();
        this.uploads.forEach(file => {
            if (file.complete && file.error === null && file.fileUrl !== null) {
                uploadedFiles.push({
                    url: file.fileUrl,
                    name: file.name
                });
            }
        });
        this.uploadController.signal.dispatchEvent(new FileUploadCompletedEvent(uploadedFiles));
    }

    private onFileInputChange(event:Event) {

        // add the status panel and hook up the events
        this.statusPanel = UploadStatusPanel.open();

        // handle allowing overwrite on a file
        this.statusPanel.addEventListener(OverwriteFileEvent.eventType, (event:Event) => {
            const overwriteEvent = event as OverwriteFileEvent;
            const fileData = this.uploads[overwriteEvent.fileIndex];

            // if allowing overwrite, retry
            if (overwriteEvent.allowOverwrite === true) {
                this.tryUpload(fileData, true);
                fileData.setNeedsAllowOverwritePermission(false);

            // otherwise cancel
            } else {
                fileData.setCancelled();
            }
        });

        // handle cancelling the upload
        this.statusPanel.addEventListener(CancelUploadEvent.eventType, (event:Event) => {
            const cancelEvent = event as CancelUploadEvent;
            this.uploads.forEach(file => file.cancelUpload());
        });


        // try upload on all files from the file input
        Array.from(this.fileInput.files as FileList).forEach(file => {
            const fileData = new UploadFileState(this.uploadController, file);
            this.uploads.push(fileData);
            this.tryUpload(fileData, false);
        });
    }

    private uploads:Array<UploadFileState> = new Array();


    private async tryUpload(fileData:UploadFileState, allowOverwrite:boolean) {
        try {

            fileData.fileController.signal.addEventListener(FileUploadProgressEvent.eventType, (event:Event) => 
                fileData.updateProgress(event as FileUploadProgressEvent));
            
            const fileName = await this.filesRepo.uploadFileWithProgress(fileData.file, {
                allowOverwrite,
                signal: fileData.fileController.signal
            });

            fileName ? fileData.setComplete(fileName) :
                fileData.setCancelled();

        } catch (error:any) {
            if (error instanceof ClientError && error.properties["reason"] === "exists") {                           
                fileData.setNeedsAllowOverwritePermission(true);                
            } else {
                fileData.setCompleteWithError(error);
            }
        }
    }
}


export class FileUploadError extends Error {
    fileState:Object;
    cause:Error;
    constructor(fileState:Object, cause:Error) {
        super("File Upload Error");
        this.cause = cause;
        this.fileState = {...fileState};
    }
}


/**
 * Used for tracking the progress of a single file
 */
class UploadFileState {
    constructor(uploadController:AbortController, file:File) {
        this._uploadController = uploadController;
        this._file = file;
        this._fileController = new AbortController();
        this._bytesTransferred = 0;
        this._totalBytes = 0;
        this._error = null;
        this._needsAllowOverwritePermission = false;
        this._complete = false;
        this._fileUrl = null;
        this._cancelled = false;
    }

    public get file() { return this._file; }
    public get fileController() { return this._fileController; }
    public get bytesTransferred() { return this._bytesTransferred; }
    public get totalBytes() { return this._totalBytes; }
    public get needsAllowOverwritePermission() { return this._needsAllowOverwritePermission; }
    public get complete() { return this._complete; }
    public get cancelled() { return this._cancelled; }
    public get error() { return this._error; }
    public get fileUrl() { return this._fileUrl; }
    /** jch - need to implement - get base64 string for thumbnail */
    public get base64Src() { return "BASE64 IMAGE FOR:" + this._file.name }
    public get name() { return this._file.name }

    
    private _uploadController:AbortController;
    private _fileController:AbortController;
    private _file:File;
    private _bytesTransferred:number;
    private _totalBytes:number;
    private _needsAllowOverwritePermission:boolean;
    private _complete:boolean;
    private _cancelled:boolean;
    private _error:Error|null;
    private _fileUrl:string|null;

    cancelUpload() {
        this._fileController.abort();
    }

    setNeedsAllowOverwritePermission(allowOverwrite:boolean) {
        this._needsAllowOverwritePermission = allowOverwrite;
        this.dispatchUpdate();
    }

    updateProgress(progress:FileUploadProgressEvent) {
        this._bytesTransferred = progress.bytesTransferred;
        this._totalBytes = progress.totalBytes;
        this.dispatchUpdate();
    }

    setCompleteWithError(error:Error) {
        this._error = error;
        this._complete = true;
        this._totalBytes = 0;
        this._bytesTransferred = 0;
        this.dispatchUpdate();
    }

    setComplete(fileUrl:string) {
        this._fileUrl = fileUrl;
        this._complete = true;
        this._bytesTransferred = this._totalBytes;
        this.dispatchUpdate();
    }

    setCancelled() {
        this._complete = true;
        this._cancelled = true;
        this._totalBytes = 0;
        this._bytesTransferred = 0;
        this.dispatchUpdate();
    }

    private dispatchUpdate() {
        this._uploadController.signal.dispatchEvent(new FileUpdatedEvent());
    }
}


interface IFileUploaderClientOptions {
    accept:FileUploaderAccept;
    multiple?: boolean;
} 


/**
 * Dispatched on the uploadController whenever
 * a file has state changes and causes
 * a recalculation of the {@link FileUploadStatusData}
 */
class FileUpdatedEvent extends Event {
    static eventType = "file-updated";
    constructor() {
        super(FileUpdatedEvent.eventType);
    }
}


/**
 * Used to communicate the overall status
 * of all uploads
 */
export class FileUploadStatusData {
    uploadFileTypes = "files";
    onFile:number = 0;
    ofFile:number = 0;
    bytesTransferred:number = 0;
    totalBytes:number = 0;
    get percentComplete():number {
        return this.totalBytes === 0 ? 0 : (this.bytesTransferred /  this.totalBytes) * 100;
    }
    /** is true when at least 1 file requires overwrite */
    requiresOverwrite:boolean = false;
    /** the index of the a file that requires overwrite permission */
    requiresOverwriteFileIndex:number = -1;
    requiresOverwriteFileName:string = "";
    errors:Array<Error> = new Array();;
    skippedFiles:Array<string> = new Array();
    /** true when all work is done */
    isComplete:boolean = false;
    /**
     * The base64 string image source of a file that
     * requires overwrite permission or is not complete
     */
    highlightFileSrc:string|null = null;
}


/**
 * DOM event for status-panel
 */
export class CancelUploadEvent extends Event {
    static eventType = "cancel-upload";
    constructor() {
        super(CancelUploadEvent.eventType, {bubbles:true, composed:true});
    }
}

/**
 * DOM event for status-panel
 */
export class OverwriteFileEvent extends Event {
    static eventType = "overwrite-file";
    allowOverwrite:boolean;
    fileIndex:number;
    constructor(fileIndex:number, allowOverwrite:boolean) {
        super(OverwriteFileEvent.eventType, {bubbles:true, composed:true});
        this.fileIndex = fileIndex;
        this.allowOverwrite = allowOverwrite;
    }
}

