import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ClientError, ServerError } from "../Errors";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbStorage } from "../HbStorage";
import { FileType } from "../interfaces/FileInterfaces";
export class HbUploadFilesRepo {
    constructor() {
        this.supportedFileTypes = {
            images: ["avif", "gif", "jpeg", "jpg", "png", "svg", "webp"],
            audio: ["mp3", "m4a", "wav", "aac", "oga", "pcm", "aiff"],
            video: ["mp4", "m4v", "mpg", "mpeg", "avi", "wmv", "webm"]
        };
        this.currentUser = new HbCurrentUser();
    }
    async uploadFile(file, options) {
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
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return url;
        }
        catch (error) {
            throw new ServerError("uploadImage error", error);
        }
    }
    async fileExists(storagePath) {
        const storageRef = ref(HbStorage.current, storagePath);
        try {
            await getDownloadURL(storageRef);
            return true;
        }
        catch (error) {
            if (error.code === "storage/object-not-found") {
                return false;
            }
            throw new ServerError("fileExists error", error);
        }
    }
    getStoragePath(fileName) {
        const ext = (fileName.split('.').pop() || "").toLowerCase();
        const fileType = this.supportedFileTypes.images.includes(ext) ? FileType.images :
            this.supportedFileTypes.audio.includes(ext) ? FileType.audio :
                this.supportedFileTypes.video.includes(ext) ? FileType.video : "files";
        return `files/${this.currentUser.uid}/${fileType}/${fileName}`;
    }
}
