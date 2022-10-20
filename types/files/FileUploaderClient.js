var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { inject } from "../domain/DependencyContainer/decorators";
import { ClientError } from "../domain/Errors";
import { UploadFilesRepoKey } from "../domain/interfaces/FileInterfaces";
import "../domain/Files/HbUploadFilesRepo";
/**
 * Opens the file browser and uploads a file.
 *
 * Usage:
 * ```js
 * const uploader = new FileUploaderClient({accept: FileUploaderAccept.audio});
 * uploader.handleFileUpload((fileName:string, {title}) => {});
 * ```
 */
export class FileUploaderClient {
    constructor(options) {
        if (options.multiple === true) {
            throw new Error("Not Implemented");
        }
        this.fileInput = this.createFileInput(options.accept);
    }
    createFileInput(accept) {
        // create the input
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        // set the accept attribute
        const acceptArray = new Array();
        if (accept === FileUploaderAccept.image) {
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
    onFileInputChange(event) {
        var file = this.fileInput.files?.item(0);
        this.tryUpload(file, { allowOverwrite: false });
    }
    async tryUpload(file, options) {
        try {
            const fileName = await this.filesRepo.uploadFile(file, options);
            this.fileUploadCallback(fileName, { title: file.name });
        }
        catch (error) {
            if (error instanceof ClientError && error.properties["reason"] === "exists") {
                const ans = confirm("The file already exists.\n\nWould you like to overwrite it?");
                if (ans) {
                    this.tryUpload(file, { allowOverwrite: true });
                }
            }
            else {
                throw error;
            }
        }
    }
    handleFileUpload(callback) {
        this.fileUploadCallback = callback;
        this.fileInput.click();
    }
}
__decorate([
    inject(UploadFilesRepoKey)
], FileUploaderClient.prototype, "filesRepo", void 0);
export var FileUploaderAccept;
(function (FileUploaderAccept) {
    FileUploaderAccept["image"] = "image";
    FileUploaderAccept["audio"] = "audio";
    FileUploaderAccept["video"] = "video";
    FileUploaderAccept["media"] = "media";
})(FileUploaderAccept || (FileUploaderAccept = {}));
;
