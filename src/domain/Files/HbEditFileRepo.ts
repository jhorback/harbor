import { doc, setDoc } from "firebase/firestore";
import { getMetadata, ref } from "firebase/storage";
import { provides } from "../DependencyContainer/decorators";
import { ServerError } from "../Errors";
import { HbCurrentUser } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { HbStorage } from "../HbStorage";
import { EditFileRepoKey, IEditFileRepo, IFileData } from "../interfaces/FileInterfaces";
import { FileModel } from "./FileModel";




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
}