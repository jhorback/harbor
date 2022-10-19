


export enum FileType {
    images = "images",
    audio = "audio",
    video = "video"
};


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
}

export interface IUploadFileOptions {
    allowOverwrite: boolean;
}