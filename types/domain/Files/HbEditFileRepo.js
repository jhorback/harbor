var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, setDoc } from "firebase/firestore";
import { deleteObject, getMetadata, ref } from "firebase/storage";
import { provides } from "../DependencyContainer/decorators";
import { ServerError } from "../Errors";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { HbStorage } from "../HbStorage";
import { EditFileRepoKey } from "../interfaces/FileInterfaces";
import { FileModel } from "./FileModel";
let EditFileRepo = class EditFileRepo {
    async extractMediaPoster(file) {
        if (!file.mediaPosterStoragePath) {
            throw new ServerError("File does not have a media poster storage path");
        }
        const currentUser = new HbCurrentUser();
        const fileRef = ref(HbStorage.current, file.mediaPosterStoragePath);
        const fileMetaData = await getMetadata(fileRef);
        const storagePath = `files/${fileRef.name}`;
        const newFile = {
            name: fileRef.name,
            uploaderUid: currentUser.uid,
            storagePath,
            type: fileMetaData.contentType || null,
            size: fileMetaData.size,
            url: file.mediaPosterUrl,
            mediaPosterUrl: null,
            mediaPosterDbPath: null,
            mediaPosterStoragePath: null,
            thumbUrl: file.thumbUrl,
            width: file.width,
            height: file.height,
            updated: fileMetaData.updated,
            mediaTags: null
        };
        // add the new file
        const newFileRef = doc(HbDb.current, storagePath);
        await setDoc(newFileRef, newFile);
        // update the existing file
        file.mediaPosterDbPath = storagePath;
        await setDoc(doc(HbDb.current, file.storagePath), file);
        return FileModel.of(newFile);
    }
    async updateMediaPoster(file, posterFile) {
        // delete the poster file if not in db
        if (file.mediaPosterStoragePath && !file.mediaPosterDbPath) {
            const fileRef = ref(HbStorage.current, file.mediaPosterStoragePath);
            await deleteObject(fileRef);
        }
        file.mediaPosterDbPath = posterFile.storagePath;
        file.mediaPosterStoragePath = posterFile.storagePath;
        file.mediaPosterUrl = posterFile.url;
        file.thumbUrl = posterFile.url;
        await setDoc(doc(HbDb.current, file.storagePath).withConverter(FileModel), file);
        return file;
    }
    async deleteFile(file) {
        throw new Error("Not implemented");
    }
};
EditFileRepo = __decorate([
    provides(EditFileRepoKey)
], EditFileRepo);
export { EditFileRepo };
