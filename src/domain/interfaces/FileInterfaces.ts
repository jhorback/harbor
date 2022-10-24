


export enum FileUploadType {
    images = "images",
    audio = "audio",
    video = "video",
    files = "files",
};


export const UploadFilesRepoKey:symbol = Symbol("UPLOAD_FILES_REPO");

export interface IUploadFilesRepo {
    supportedFileTypes: {
        images: Array<string>,
        audio: Array<string>,
        video: Array<string>
    };

    getFileTypeFromExtension(fileName:string):FileUploadType;

    /**
     * Uploads a file to storage and adds it to the database.
     * It resolves with the url to access the uploaded file.
     * If it resolves with null, the operation was cancelled.
     * 
     * If the allowOverwrite option is false this method can throw
     * a ClientError which can be used to ask the user to overwrite
     * the file and try again.
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

/**
 * This is dispatched on the signal provided in {@link IUploadFileOptions}
 * to report file upload progress.
 */
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

/**
 * This is used internally on the {@link FileUploaderClient}
 * on the uploadController signal to listen for when all files have
 * finished uploading.
 */
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

/**
 * The result of a file upload
 * containing the url and file name
 */
export interface IUploadedFile {
    url:string,
    name:string
}

export interface IMediaTags {
    title:string,
    artist:string,
    album:string,
    year:number,
    track:number,
    genre:string,
    picture:IMediaTagPicture
}

export interface IMediaTagPicture {
    format:string,
    data:Array<number>
}

/**
 * The file data stored in the
 * database
 */
export interface IFileData {
    name:string;
    ownerUid:string;
    storagePath:string;
    url:string;
    /** Can be a url to storage or a base64 string */
    thumbUrl:string;
    size: number;
    type?: string;
    updated: string;
    mediaTags: IMediaTags|null
}
