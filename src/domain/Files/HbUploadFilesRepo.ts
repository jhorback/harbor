import { getDownloadURL, ref, uploadBytes, UploadResult } from "firebase/storage";
import { ClientError, ServerError } from "../Errors";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbStorage } from "../HbStorage";
import { FileType, IUploadFileOptions, IUploadFilesRepo } from "../interfaces/FileInterfaces";



export class HbUploadFilesRepo implements IUploadFilesRepo {
    private currentUser:HbCurrentUser;

    supportedFileTypes = {
        images: ["avif", "gif", "jpeg", "jpg", "png", "svg", "webp"],
        audio: ["mp3", "m4a", "wav", "aac", "oga", "pcm", "aiff"],
        video: ["mp4", "m4v", "mpg", "mpeg", "avi", "wmv", "webm"]
    };

    constructor() {
        this.currentUser = new HbCurrentUser();
    }

    async uploadFile(file:File, options:IUploadFileOptions):Promise<string> {
        const storagePath = this.getStoragePath(file.name);
        const storageRef = ref(HbStorage.current, storagePath);

        if (options.allowOverwrite === false) {
            const exists = await this.fileExists(storagePath);
            if (exists) {
                throw ClientError.of("File Exists", {
                    "reason": "exists"
                });
            }
        }

        try {
            const snapshot:UploadResult = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return url;

        } catch(error:any) {
            throw new ServerError("uploadImage error", error);
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