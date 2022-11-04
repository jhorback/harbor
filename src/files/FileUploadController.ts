import { inject } from "../domain/DependencyContainer/decorators";
import { ClientError } from "../domain/Errors";
import { FileUploadType, FileUploadProgressEvent, IUploadedFile, IUploadFilesRepo, UploadFilesRepoKey } from "../domain/interfaces/FileInterfaces";
import "../domain/Files/HbUploadFilesRepo";
import { convertPictureToBase64Src, extractMediaTags } from "../domain/Files/extractMediaTags";
import { StateController, stateProperty, hostEvent } from "@domx/statecontroller";
import { FileUploadPanel, FileUploaderAccept, FileUploadCompleteEvent } from "./hb-file-upload-panel";



/**
 * The FileUploadController.state object
 */
 export class FileUploadState {
    uploadFileTypes = "files";
    onFile:number = 0;
    ofFile:number = 0;
    bytesTransferred:number = 0;
    totalBytes:number = 0;
    get percentComplete():number {
        return this.totalBytes === 0 ? 0 : Math.round((this.bytesTransferred /  this.totalBytes) * 100);
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

/** Host event to cancel the upload */
export class CancelUploadEvent extends Event {
    static eventType = "cancel-upload";
    constructor() {
        super(CancelUploadEvent.eventType);
    }
}

/** Host event to allow overwriting a file */
export class OverwriteFileEvent extends Event {
    static eventType = "overwrite-file";
    allowOverwrite:boolean;
    fileIndex:number;
    constructor(fileIndex:number, allowOverwrite:boolean) {
        super(OverwriteFileEvent.eventType);
        this.fileIndex = fileIndex;
        this.allowOverwrite = allowOverwrite;
    }
}


/**
 */
export class FileUploadController extends StateController {

    @stateProperty()
    state:FileUploadState = new FileUploadState();

    @inject(UploadFilesRepoKey)
    private filesRepo!:IUploadFilesRepo;

    private fileInput:HTMLInputElement;

    private fileUpdatedEventBus:EventTarget;

    private uploads:Array<FileState> = new Array();

    host:FileUploadPanel;

    constructor(host:FileUploadPanel) {
        super(host);
        this.host = host;
        this.fileInput = this.createFileInput(host.accept);
        this.fileUpdatedEventBus = this.createEventBus();
    }

    openFileSelector() {
        this.setFileInputAttributes();

        /** on change, calls: {@link onFileInputChange} */
        this.fileInput.click();
    }

    private setFileInputAttributes() {
        const accept = this.host.accept;
        const multiple = this.host.multiple;

         // create the file input
         
         this.fileInput.setAttribute("type", "file");
         
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
         this.fileInput.setAttribute("accept", `.${acceptArray.join(", .")}`);
 
         // set the multiple attribute
         multiple && this.fileInput.setAttribute("multiple", "");
    }

    private createFileInput(accept:FileUploaderAccept):HTMLInputElement {
        const input = document.createElement("input");

        // listen for change event
        input.addEventListener("change", this.onFileInputChange.bind(this));
        return input;
    }

    private createEventBus():EventTarget {
        const bus = new EventTarget();
        bus.addEventListener(FileUpdatedEvent.eventType, (event:Event) =>
            this.onFileUpdated(event as FileUpdatedEvent));
        return bus;
    }

    private onFileUpdated(event:FileUpdatedEvent) {
        this.state = getNextState(this.host.accept, this.uploads);
        this.requestUpdate(event);
        if (this.state.isComplete) {
            this.dispatchCompletedEvent();
        }
    }

    private dispatchCompletedEvent() {
        const uploadedFiles = new Array<IUploadedFile>();
        this.uploads.forEach(file => {
            if (file.complete && file.error === null && file.uploadedFile !== null) {
                uploadedFiles.push(file.uploadedFile);
            }
        });
        this.host.dispatchEvent(new FileUploadCompleteEvent(uploadedFiles));
    }

    @hostEvent(OverwriteFileEvent)
    overwriteFile(event:OverwriteFileEvent) {
        const fileData = this.uploads[event.fileIndex];

        // if allowing overwrite, retry
        if (event.allowOverwrite === true) {
            this.tryUpload(fileData, true);
            fileData.setNeedsAllowOverwritePermission(false);

        // otherwise cancel
        } else {
            fileData.setCancelled();
        }
    }

    @hostEvent(CancelUploadEvent)
    cancelUpload(event:CancelUploadEvent) {
        this.uploads.forEach(file => file.cancelUpload());
    }

    private onFileInputChange(event:Event) {

        // try upload on all files from the file input
        Array.from(this.fileInput.files as FileList).forEach(file => {
            const fileData = new FileState(this.fileUpdatedEventBus, file,
                this.filesRepo.getFileTypeFromExtension(file.name));
            this.uploads.push(fileData);
            this.tryUpload(fileData, false);
        });

        // show the panel
        this.host.showPanel();
    }

    private async tryUpload(fileData:FileState, allowOverwrite:boolean) {
        try {

            fileData.fileController.signal.addEventListener(FileUploadProgressEvent.eventType, (event:Event) => 
                fileData.updateProgress(event as FileUploadProgressEvent));
            
            const uploadedFile = await this.filesRepo.uploadFileWithProgress(fileData.file, {
                allowOverwrite,
                signal: fileData.fileController.signal
            });

            uploadedFile ? fileData.setComplete(uploadedFile) :
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


const getNextState = (accept:FileUploaderAccept, uploads:Array<FileState>):FileUploadState => {
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
    if (numberComplete !== uploads.length) {            
        state.onFile = uploads.length - numberComplete;

    } else {
        state.isComplete = true;
    }
    return state;
};


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
class FileState {
    constructor(fileUpdatedEventBus:EventTarget, file:File, fileType:FileUploadType) {
        this.fileUpdatedEventBus = fileUpdatedEventBus;
        this._file = file;
        this._fileController = new AbortController();
        this._bytesTransferred = 0;
        this._totalBytes = 0;
        this._error = null;
        this._needsAllowOverwritePermission = false;
        this._complete = false;
        this._cancelled = false;
        this._base64Src = this.setBase64Src(fileType)
    }

    setBase64Src(fileType:FileUploadType):string {
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
        } catch(e) {
            console.log("Unable to pull media tags", e);
        }
    }

    public get file() { return this._file; }
    public get fileController() { return this._fileController; }
    public get bytesTransferred() { return this._bytesTransferred; }
    public get totalBytes() { return this._totalBytes; }
    public get needsAllowOverwritePermission() { return this._needsAllowOverwritePermission; }
    public get complete() { return this._complete; }
    public get cancelled() { return this._cancelled; }
    public get error() { return this._error; }
    public get uploadedFile() { return this._uploadedFile; }
    public get base64Src() { return this._base64Src; }
    public get name() { return this._file.name }

    
    private fileUpdatedEventBus:EventTarget;
    private _fileController:AbortController;
    private _file:File;
    private _bytesTransferred:number;
    private _totalBytes:number;
    private _needsAllowOverwritePermission:boolean;
    private _complete:boolean;
    private _cancelled:boolean;
    private _error:Error|null;
    private _uploadedFile:IUploadedFile|null = null;
    private _base64Src:string;

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

    setComplete(uploadedFile:IUploadedFile) {
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

    private dispatchUpdate() {
        this.fileUpdatedEventBus.dispatchEvent(new FileUpdatedEvent());
    }
}


/**
 * Dispatched on the uploadController whenever
 * a file has state changes and causes
 * a recalculation of the {@link FileUploadState}
 */
class FileUpdatedEvent extends Event {
    static eventType = "file-updated";
    constructor() {
        super(FileUpdatedEvent.eventType);
    }
}


