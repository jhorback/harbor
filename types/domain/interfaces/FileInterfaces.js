export var FileType;
(function (FileType) {
    FileType["images"] = "images";
    FileType["audio"] = "audio";
    FileType["video"] = "video";
})(FileType || (FileType = {}));
;
export const UploadFilesRepoKey = Symbol("UPLOAD_FILES_REPO");
export class FileUploadProgressEvent extends Event {
    constructor(bytesTransferred, totalBytes) {
        super(FileUploadProgressEvent.eventType);
        this.bytesTransferred = bytesTransferred;
        this.totalBytes = totalBytes;
    }
}
FileUploadProgressEvent.eventType = "file-upload-progress";
export class FileUploadCompletedEvent extends Event {
    constructor(uploadedFiles) {
        super(FileUploadCompletedEvent.eventType);
        this.uploadedFiles = uploadedFiles;
        this.uploadedFile = uploadedFiles[0];
    }
}
FileUploadCompletedEvent.eventType = "file-upload-complete";
