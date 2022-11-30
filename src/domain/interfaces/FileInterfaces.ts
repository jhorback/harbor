import { FileUploaderAccept } from "../../files/hb-file-upload-panel";
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
    type?:FileType
}



export enum FileType {
    image = "image",
    audio = "audio",
    video = "video",
    file = "file",
};


export const UploadFilesRepoKey:symbol = Symbol("UPLOAD_FILES_REPO");

export interface IUploadFilesRepo {
    MAX_UPLOAD_SIZE: number;
    MAX_THUMB_SIZE: number;

    supportedFileTypes: {
        image: Array<string>,
        audio: Array<string>,
        video: Array<string>
    };

    getFileTypeFromExtension(fileName:string):FileType;

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
    thumbUrl:string|null,
    pictureUrl:string|null,
    type:string|null,
    name:string,
    fileDbPath:string,
    width:number|null,
    height:number|null
}

export interface IMediaTags {
    title:string|null,
    artist:string|null,
    album:string|null,
    year:number|null,
    track:number|null,
    genre:string|null,
    picture?:IMediaTagPicture
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
    uploaderUid:string;
    storagePath:string;
    url:string;
    /** Url for thumbnail size display <= 250px */
    thumbUrl:string|null;
    /** For media types this is the picture/photo to represent the media */
    pictureUrl:string|null;
    pictureFileName: string | null;
    size: number;
    type: string|null;
    /** width of the full image or thumbnail */
    width: number|null;
    /** height of the full image or thumbnail */
    height: number|null;
    updated: string;
    mediaTags: IMediaTags|null
}