import { inject } from "../domain/DependencyContainer/decorators";
import { ClientError } from "../domain/Errors";
import { IUploadFileOptions, IUploadFilesRepo, UploadFilesRepoKey } from "../domain/interfaces/FileInterfaces";
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

    @inject(UploadFilesRepoKey)
    private filesRepo!:IUploadFilesRepo;

    private fileInput:HTMLInputElement;

    private fileUploadCallback:FileUploadCallback|undefined;

    constructor(options:IFileUploaderClientOptions) {
        if (options.multiple === true) {
            throw new Error("Not Implemented");
        }
        this.fileInput = this.createFileInput(options.accept);
    }

    private createFileInput(accept:FileUploaderAccept):HTMLInputElement {

        // create the input
        const input = document.createElement("input");
        input.setAttribute("type", "file");
        
        // set the accept attribute
        const acceptArray = new Array();
        if (accept === FileUploaderAccept.image) {
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

    private onFileInputChange(event:Event) {
        var file = this.fileInput.files?.item(0) as File;
        this.tryUpload(file, {allowOverwrite:false});
    }

    private async tryUpload(file:File, options:IUploadFileOptions) {
        try {

            const fileName = await this.filesRepo.uploadFile(file, options);
            this.fileUploadCallback!(fileName, { title: file.name });

        } catch (error:any) {

            if (error instanceof ClientError && error.properties["reason"] === "exists") {

                const ans = confirm("The file already exists.\n\nWould you like to overwrite it?");
                if (ans) {
                    this.tryUpload(file, {allowOverwrite: true});
                }

            } else {
                throw error;
            }
        }
    }

    handleFileUpload(callback:FileUploadCallback) {
        this.fileUploadCallback = callback;
        this.fileInput.click();
    }
}


export enum FileUploaderAccept {
    image = "image",
    audio = "audio",
    video = "video",
    media = "media"
};

export type FileUploadCallback = (fileName:string, meta:{ title: string }) => void;

interface IFileUploaderClientOptions {
    accept:FileUploaderAccept;
    multiple?: boolean;
} 
