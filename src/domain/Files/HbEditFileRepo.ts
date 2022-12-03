import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { deleteObject, getMetadata, ref } from "firebase/storage";
import { provides } from "../DependencyContainer/decorators";
import { ServerError } from "../Errors";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { HbStorage } from "../HbStorage";
import { EditFileRepoKey, IEditFileRepo, IFileData } from "../interfaces/FileInterfaces";
import { FileModel } from "./FileModel";
import { FindFileRepo } from "./HbFindFileRepo";




@provides(EditFileRepoKey)
export class EditFileRepo implements IEditFileRepo {
    async extractMediaPoster(file:FileModel):Promise<FileModel> {

        if (!file.mediaPosterStoragePath) {
            throw new ServerError("File does not have a media poster storage path");
        }

        const currentUser = new HbCurrentUser();

        const fileRef = ref(HbStorage.current, file.mediaPosterStoragePath);
        const fileMetaData = await getMetadata(fileRef);
        const storagePath = `files/${fileRef.name}`;
        const newFile:IFileData = {
            name: fileRef.name,
            uploaderUid: currentUser.uid!,
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

    async updateMediaPoster(file:FileModel, posterFile:FileModel):Promise<FileModel> {

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

    async deleteFile(name:string):Promise<void> {
        const fileRepo = new FindFileRepo();
        const file = await fileRepo.findFile(`files/${name}`);
        if (!file) {
            console.warn("HbEditFileRepo - file to delete does not exist:", name);
            return;
        }

        const fileRef = ref(HbStorage.current, file.storagePath);
        await deleteObject(fileRef);
        await deleteDoc(doc(HbDb.current, file.storagePath));
    }
    
}