export const FindFileRepoKey = Symbol("FIND_FILE_REPO");
export const SearchFilesRepoKey = Symbol("SEARCH_FILES_REPO");
export var FileType;
(function (FileType) {
    FileType["image"] = "image";
    FileType["audio"] = "audio";
    FileType["video"] = "video";
    FileType["file"] = "file";
})(FileType || (FileType = {}));
;
export const UploadFilesRepoKey = Symbol("UPLOAD_FILES_REPO");
/**
 * This is dispatched on the signal provided in {@link IUploadFileOptions}
 * to report file upload progress.
 */
export class FileUploadProgressEvent extends Event {
    constructor(bytesTransferred, totalBytes) {
        super(FileUploadProgressEvent.eventType);
        this.bytesTransferred = bytesTransferred;
        this.totalBytes = totalBytes;
    }
    static { this.eventType = "file-upload-progress"; }
}
