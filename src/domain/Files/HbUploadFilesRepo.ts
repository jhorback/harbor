import { getDownloadURL, ref, uploadBytes, uploadBytesResumable, UploadResult } from "firebase/storage";
import { provides } from "../DependencyContainer/decorators";
import { ClientError, ServerError } from "../Errors";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbStorage } from "../HbStorage";
import { FileType, FileUploadProgressEvent, IUploadFileOptions, IUploadFilesRepo, UploadFilesRepoKey } from "../interfaces/FileInterfaces";



@provides<IUploadFilesRepo>(UploadFilesRepoKey)
export class HbUploadFilesRepo implements IUploadFilesRepo {
    private currentUser:HbCurrentUser;

    supportedFileTypes = {
        images: ["avif", "gif", "jpeg", "jpg", "png", "svg", "webp"],
        audio: ["aac", "aiff", "m4a", "mp3", "oga", "pcm", "wav"],
        video: ["avi", "m4v", "mp4",  "mpeg", "mpg", "webm", "wmv"]
    };

    constructor() {
        this.currentUser = new HbCurrentUser();
    }

    async uploadFile(file:File, options:IUploadFileOptions):Promise<string> {
        const storagePath = this.getStoragePath(file.name);

        await this.verifyOverwrite(options.allowOverwrite, storagePath);

        try {
            const storageRef = ref(HbStorage.current, storagePath);
            const snapshot:UploadResult = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return url;

        } catch(error:any) {
            throw new ServerError("uploadImage error", error);
        }        
    }

    async uploadFileWithProgress(file:File, options:IUploadFileOptions):Promise<string|null> {
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
                async () => resolve( await getDownloadURL(uploadTask.snapshot.ref))
            );
        });
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
        const ext = (fileName.split('.').pop() || "").toLowerCase();
        const fileType = this.supportedFileTypes.images.includes(ext) ? FileType.images :
            this.supportedFileTypes.audio.includes(ext) ? FileType.audio :
            this.supportedFileTypes.video.includes(ext) ? FileType.video : "files";
        return `files/${this.currentUser.uid}/${fileType}/${fileName}`;
    }
}