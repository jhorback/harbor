


export enum FileType {
    images = "images",
    audio = "audio",
    video = "video"
};


export const UploadFilesRepoKey:symbol = Symbol("UPLOAD_FILES_REPO");

export interface IUploadFilesRepo {
    supportedFileTypes: {
        images: Array<string>,
        audio: Array<string>,
        video: Array<string>
    };

    /**
     * Will throw a ClientError if the allowOverwrite option is false
     * and the file exists.
     * @param file 
     * @param options 
     */
    uploadFile(file:File, options:IUploadFileOptions):Promise<string>;

    /**
     * Will replace uploadFile after testing.
     * @param file 
     * @param options 
     */
    uploadFileWithProgress(file:File, options:IUploadFileOptions):Promise<string|null>
}

export interface IUploadFileOptions {
    allowOverwrite: boolean;
    /**
     * The file upload can be cancelled by calling abort on the AbortController
     * For progress, the signal will dispatch the FileUploadProgressEvent.
     */
    signal?:AbortSignal;
}

export class FileUploadProgressEvent extends Event {
    static eventType = "file-upload-progress";
    bytesTransferred: number;
    totalBytes: number;
    constructor(bytesTransferred:number, totalBytes:number) {
        super(FileUploadProgressEvent.eventType);
        this.bytesTransferred = bytesTransferred;
        this.totalBytes = totalBytes;
    }
}


export class FileUploadCompletedEvent extends Event {
    static eventType = "file-upload-complete";
    uploadedFile:IUploadedFile|null;
    uploadedFiles:Array<IUploadedFile>;
    constructor(uploadedFiles:Array<IUploadedFile>) {
        super(FileUploadCompletedEvent.eventType);
        this.uploadedFiles = uploadedFiles;
        this.uploadedFile = uploadedFiles[0];
    }
}

export interface IUploadedFile {
    url:string,
    name:string
}
