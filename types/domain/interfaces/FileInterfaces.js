export var FileUploadType;
(function (FileUploadType) {
    FileUploadType["images"] = "images";
    FileUploadType["audio"] = "audio";
    FileUploadType["video"] = "video";
    FileUploadType["files"] = "files";
})(FileUploadType || (FileUploadType = {}));
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
}
FileUploadProgressEvent.eventType = "file-upload-progress";
/**
 * This is used internally on the {@link FileUploaderClient}
 * on the uploadController signal to listen for when all files have
 * finished uploading.
 */
export class FileUploadCompletedEvent extends Event {
    constructor(uploadedFiles) {
        super(FileUploadCompletedEvent.eventType);
        this.uploadedFiles = uploadedFiles;
        this.uploadedFile = uploadedFiles[0];
    }
}
FileUploadCompletedEvent.eventType = "file-upload-complete";
