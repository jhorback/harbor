import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getMetadata, ref, uploadBytes, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { provides } from "../DependencyContainer/decorators";
import { ClientError, ServerError } from "../Errors";
import { authorize, HbCurrentUser, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { HbStorage } from "../HbStorage";
import { FileType, FileUploadProgressEvent, IFileData, IMediaTags, IUploadFileOptions, IUploadFilesRepo, UploadFilesRepoKey, IUploadedFile } from "../interfaces/FileInterfaces";
import { convertPictureToBase64Src, convertPictureToFile, extractMediaTags } from "./extractMediaTags";
import { resizeImageFile } from "./resizeImageFile";



@provides<IUploadFilesRepo>(UploadFilesRepoKey)
export class HbUploadFilesRepo implements IUploadFilesRepo {
    private currentUser:HbCurrentUser;

    constructor() {
        this.currentUser = new HbCurrentUser();
    }

    MAX_UPLOAD_SIZE = 1280;

    MAX_THUMB_SIZE = 250;

    supportedFileTypes = {
        image: ["avif", "gif", "jpeg", "jpg", "png", "svg", "webp"],
        audio: ["aac", "aiff", "m4a", "mp3", "oga", "pcm", "wav"],
        video: ["avi", "m4v", "mp4",  "mpeg", "mpg", "webm", "wmv"]
    };

    getFileTypeFromExtension(fileName:string):FileType {
        const ext = (fileName.split('.').pop() || "").toLowerCase();
        return this.supportedFileTypes.image.includes(ext) ? FileType.image :
            this.supportedFileTypes.audio.includes(ext) ? FileType.audio :
            this.supportedFileTypes.video.includes(ext) ? FileType.video : FileType.file;
    }

    @authorize(UserAction.uploadFiles)
    async uploadFileWithProgress(file:File, options:IUploadFileOptions):Promise<IUploadedFile|null> {
        const storagePath = this.getStoragePath(file.name);        

        await this.verifyOverwrite(options.allowOverwrite, storagePath);

        const storageRef = ref(HbStorage.current, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);

        options.signal?.addEventListener("abort", () => {
            uploadTask.cancel();
        });
    
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => options.signal?.dispatchEvent(
                    new FileUploadProgressEvent(snapshot.bytesTransferred, snapshot.totalBytes)),
                (error) => error.code === "storage/canceled" ?
                    resolve(null) : reject(new ServerError("File Upload Error", error)),
                async () => {
                    const uploadedFile = await this.addFileToDb(file, uploadTask.snapshot);
                    resolve(uploadedFile);
                }
            );
        });
    }

    /**
     * Resolves with the uploaded file information
     */
    private async addFileToDb(file:File, snapshot:UploadTaskSnapshot):Promise<IUploadedFile> {
        const dbStoragePath = `files/${file.name}`;

        const [md, url, mediaTags] = await Promise.all([
            getMetadata(snapshot.ref),
            getDownloadURL(snapshot.ref),
            this.resolveMediaTags(file)
        ]);

        // generate the picture for media files
        const pictureData = await this.storePicture(file, mediaTags);

        // generate the thumbnail
        const thumbData = await this.storeThumb(url, file, pictureData);

        // remove the binary picture data before storing
        delete mediaTags?.picture; 

        const fileData:IFileData = {
            name: md.name,
            uploaderUid: this.currentUser.uid!,
            storagePath: dbStoragePath,
            type: md.contentType || null,
            size: md.size,
            url,
            pictureUrl: pictureData?.url || null,
            thumbUrl: thumbData?.url || null,
            width: thumbData?.width || null,
            height: thumbData?.height || null,
            updated: md.updated,
            mediaTags
        };

        
        const ref = doc(HbDb.current, dbStoragePath);
        await setDoc(ref, fileData);
        return {
            fileDbPath: ref.path,
            name: file.name,
            url,
            thumbUrl: fileData.thumbUrl,
            pictureUrl: fileData.pictureUrl,
            type: fileData.type,
            width: fileData.width,
            height: fileData.height
        };
    }

    private async storePicture(file:File, mediaTags:IMediaTags|null):Promise<IImageData|null> {
        if (mediaTags === null || mediaTags.picture === undefined) {
            return null;
        }

        const pictureFile = convertPictureToFile(file.name, mediaTags.picture, ".picture");
        const resizedPictureFile = await resizeImageFile(pictureFile, this.MAX_UPLOAD_SIZE);
        const storagePath = this.getStoragePath(resizedPictureFile.file.name);
        const storageRef = ref(HbStorage.current, storagePath);
        const snapshot = await uploadBytes(storageRef, resizedPictureFile.file)
        const url = await getDownloadURL(snapshot.ref);
        return {
            url,
            width: resizedPictureFile.resizedWidth,
            height: resizedPictureFile.resizedHeight,
            file: resizedPictureFile.file
        };
    }

    /**
     * Generates a thumb image and stores it using pictureData or the file if an image.
     * Otherwise returns null
     */
    private async storeThumb(fileUrl:string, file:File, pictureData:IImageData|null):Promise<IImageData|null> {
        const awaitThumb = pictureData ? resizeImageFile(pictureData.file, this.MAX_THUMB_SIZE, ".thumb") :
            this.getFileTypeFromExtension(file.name) === FileType.image ? 
                resizeImageFile(file, this.MAX_THUMB_SIZE, ".thumb") : null;

        const thumb = await awaitThumb;

        // we don't have a thumb (non image or media)
        if (thumb === null) {
            return null;

        // picture is same as thumb (not resized)
        } else if (pictureData && thumb.file === pictureData.file) {
            return pictureData;

        // file is the same as thumb (not resized)
        } else if (file === thumb.file) {
            return {
                file,
                width: thumb.originalWidth,
                height: thumb.originalHeight,
                url: fileUrl
            };
        }

        // store resized thumb
        const storagePath = this.getStoragePath(thumb.file.name);
        const storageRef = ref(HbStorage.current, storagePath);
        const snapshot = await uploadBytes(storageRef, thumb.file)
        const url = await getDownloadURL(snapshot.ref);

        return {
            file: thumb.file,
            width: thumb.originalWidth,
            height: thumb.originalHeight,
            url
        };
    }

    private async resolveMediaTags(file:File):Promise<IMediaTags|null> {
        try {
            return await extractMediaTags(file);
        } catch(error) {
            return null;
        }
    }

    private async verifyOverwrite(allowOverwrite:boolean, storagePath:string):Promise<void> {
        if (allowOverwrite === false) {
            const exists = await this.fileExists(storagePath);
            if (exists) {
                throw ClientError.of("File Exists", {
                    "reason": "exists"
                });
            }
        }
    }

    private async fileExists(storagePath:string):Promise<boolean> {
        const storageRef = ref(HbStorage.current, storagePath);
        try {
            await getDownloadURL(storageRef);
            return true;
        } catch(error:any) {
            if (error.code === "storage/object-not-found") {
                return false;
            }
            throw new ServerError("fileExists error", error);
        }
    }

    private getStoragePath(fileName:string) { 
        return `files/${fileName}`;
    }
}


interface IImageData {
    url: string|null,
    width: number,
    height: number,
    file: File
}


