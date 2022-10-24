var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getMetadata, ref, uploadBytesResumable } from "firebase/storage";
import { provides } from "../DependencyContainer/decorators";
import { ClientError, ServerError } from "../Errors";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { HbStorage } from "../HbStorage";
import { FileUploadType, FileUploadProgressEvent, UploadFilesRepoKey } from "../interfaces/FileInterfaces";
import { convertPictureToBase64Src, extractMediaTags } from "./extractMediaTags";
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
        return this.supportedFileTypes.images.includes(ext) ? FileUploadType.images :
            this.supportedFileTypes.audio.includes(ext) ? FileUploadType.audio :
                this.supportedFileTypes.video.includes(ext) ? FileUploadType.video : FileUploadType.files;
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
                resolve(null) : reject(new ServerError("File Upload Error", error)), async () => {
                const url = await this.addFileToDb(file, uploadTask.snapshot);
                resolve(url);
            });
        });
    }
    /**
     * Resolves with the download url
     */
    async addFileToDb(file, snapshot) {
        const storagePath = snapshot.ref.fullPath;
        const [md, url, mediaTags] = await Promise.all([
            getMetadata(snapshot.ref),
            getDownloadURL(snapshot.ref),
            this.resolveMediaTags(file)
        ]);
        const thumbUrl = mediaTags ? convertPictureToBase64Src(mediaTags.picture) : url;
        const fileData = {
            name: md.name,
            ownerUid: this.currentUser.uid,
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
        return url;
    }
    async resolveMediaTags(file) {
        try {
            return await extractMediaTags(file);
        }
        catch (error) {
            return null;
        }
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
        return `users/${this.currentUser.uid}/${fileName}`;
    }
};
HbUploadFilesRepo = __decorate([
    provides(UploadFilesRepoKey)
], HbUploadFilesRepo);
export { HbUploadFilesRepo };
