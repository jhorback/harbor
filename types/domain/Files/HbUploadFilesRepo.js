var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from "firebase/storage";
import { provides } from "../DependencyContainer/decorators";
import { ClientError, ServerError } from "../Errors";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbStorage } from "../HbStorage";
import { FileType, FileUploadProgressEvent, UploadFilesRepoKey } from "../interfaces/FileInterfaces";
let HbUploadFilesRepo = class HbUploadFilesRepo {
    constructor() {
        this.supportedFileTypes = {
            images: ["avif", "gif", "jpeg", "jpg", "png", "svg", "webp"],
            audio: ["aac", "aiff", "m4a", "mp3", "oga", "pcm", "wav"],
            video: ["avi", "m4v", "mp4", "mpeg", "mpg", "webm", "wmv"]
        };
        this.currentUser = new HbCurrentUser();
    }
    getFileTypeFromExtension(fileName) {
        const ext = (fileName.split('.').pop() || "").toLowerCase();
        return this.supportedFileTypes.images.includes(ext) ? FileType.images :
            this.supportedFileTypes.audio.includes(ext) ? FileType.audio :
                this.supportedFileTypes.video.includes(ext) ? FileType.video : FileType.files;
    }
    async uploadFile(file, options) {
        const storagePath = this.getStoragePath(file.name);
        await this.verifyOverwrite(options.allowOverwrite, storagePath);
        try {
            const storageRef = ref(HbStorage.current, storagePath);
            const snapshot = await uploadBytes(storageRef, file);
            const url = await getDownloadURL(snapshot.ref);
            return url;
        }
        catch (error) {
            throw new ServerError("uploadImage error", error);
        }
    }
    async uploadFileWithProgress(file, options) {
        const storagePath = this.getStoragePath(file.name);
        await this.verifyOverwrite(options.allowOverwrite, storagePath);
        const storageRef = ref(HbStorage.current, storagePath);
        const uploadTask = uploadBytesResumable(storageRef, file);
        options.signal?.addEventListener("abort", () => {
            uploadTask.cancel();
        });
        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed', (snapshot) => options.signal?.dispatchEvent(new FileUploadProgressEvent(snapshot.bytesTransferred, snapshot.totalBytes)), (error) => error.code === "storage/canceled" ?
                resolve(null) : reject(new ServerError("File Upload Error", error)), async () => resolve(await getDownloadURL(uploadTask.snapshot.ref)));
        });
    }
    async verifyOverwrite(allowOverwrite, storagePath) {
        if (allowOverwrite === false) {
            const exists = await this.fileExists(storagePath);
            if (exists) {
                throw ClientError.of("File Exists", {
                    "reason": "exists"
                });
            }
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
        return `files/${this.currentUser.uid}/${this.getFileTypeFromExtension(fileName)}/${fileName}`;
    }
};
HbUploadFilesRepo = __decorate([
    provides(UploadFilesRepoKey)
], HbUploadFilesRepo);
export { HbUploadFilesRepo };
