import { doc, getDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbDb } from "../HbDb";
import { FindFileRepoKey, IFindFileRepo } from "../interfaces/FileInterfaces";
import { FileModel } from "./FileModel";




@provides(FindFileRepoKey)
export class FindFileRepo implements IFindFileRepo {
    async findFile(path:string):Promise<FileModel|null> {
        const docRef = doc(HbDb.current, path).withConverter(FileModel);
        const docSnap = await getDoc<FileModel>(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    }
}