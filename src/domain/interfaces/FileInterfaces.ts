import { FileModel } from "../Files/FileModel";



export const FindFileRepoKey:symbol = Symbol("FIND_FILE_REPO");
export interface IFindFileRepo {
    findFile(path:string):Promise<FileModel|null>;
}


export const SearchFilesRepoKey:symbol = Symbol("SEARCH_FILES_REPO");
export interface ISearchFilesRepo {
    searchFiles(options:ISearchFilesOptions):Promise<Array<FileModel>>;
}
export interface ISearchFilesOptions {
    text?:string;
}




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
     * It resolves with uploaded file data.
     * If it resolves with null, the operation was cancelled.
     * 
     * If the allowOverwrite option is false this method can throw
     * a ClientError which can be used to ask the user to overwrite
     * the file and try again.
     */
    uploadFileWithProgress(file:File, options:IUploadFileOptions):Promise<IUploadedFile|null>
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
 * The result of a file upload
 * containing the url and file name
 */
export interface IUploadedFile {
    url:string,
    name:string,
    fileDbPath:string
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