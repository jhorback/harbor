import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getMetadata, ref, uploadBytesResumable, UploadTaskSnapshot } from "firebase/storage";
import { provides } from "../DependencyContainer/decorators";
import { ClientError, ServerError } from "../Errors";
import { authorize, HbCurrentUser, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { HbStorage } from "../HbStorage";
import { FileType, FileUploadProgressEvent, IFileData, IMediaTags, IUploadFileOptions, IUploadFilesRepo, UploadFilesRepoKey, IUploadedFile } from "../interfaces/FileInterfaces";
import { convertPictureToBase64Src, extractMediaTags } from "./extractMediaTags";



@provides<IUploadFilesRepo>(UploadFilesRepoKey)
export class HbUploadFilesRepo implements IUploadFilesRepo {
    private currentUser:HbCurrentUser;

    constructor() {
        this.currentUser = new HbCurrentUser();
    }

    supportedFileTypes = {
        image: ["avif", "gif", "jpeg", "jpg", "png", "svg", "webp"],
        audio: ["aac", "aiff", "m4a", "mp3", "oga", "pcm", "wav"],
        video: ["avi", "m4v", "mp4",  "mpeg", "mpg", "webm", "wmv"]
    };

    getFileTypeFromExtension(fileName:string):FileType {
        const ext = (fileName.split('.').pop() || "").toLowerCase();
        return this.supportedFileTypes.image.includes(ext) ? FileType.image :
            this.supportedFileTypes.audio.includes(ext) ? FileType.audio :
            this.supportedFileTypes.video.includes(ext) ? FileType.video : FileType.files;
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
     * Resolves with the download url
     */
    private async addFileToDb(file:File, snapshot:UploadTaskSnapshot):Promise<IUploadedFile> {
        const storagePath = snapshot.ref.fullPath;

        const [md, url, mediaTags] = await Promise.all([
            getMetadata(snapshot.ref),
            getDownloadURL(snapshot.ref),
            this.resolveMediaTags(file)
        ]);

        const thumbUrl = mediaTags ? convertPictureToBase64Src(mediaTags.picture) : url;
        const fileData:IFileData = {
            name: md.name,
            ownerUid: this.currentUser.uid!,
            storagePath,
            url,
            thumbUrl,
            size: md.size,
            type: md.contentType,
            updated: md.updated,
            mediaTags
        };

        
        const ref = doc(HbDb.current, `users/${this.currentUser.uid}/files`, file.name);
        await setDoc(ref, fileData);
        return {
            fileDbPath: ref.path,
            name: file.name,
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
        return `users/${this.currentUser.uid}/${fileName}`;
    }
}


