var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { doc, getDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbDb } from "../HbDb";
import { FindFileRepoKey } from "../interfaces/FileInterfaces";
import { FileModel } from "./FileModel";
let FindFileRepo = class FindFileRepo {
    async findFile(path) {
        const docRef = doc(HbDb.current, path).withConverter(FileModel);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    }
};
FindFileRepo = __decorate([
    provides(FindFileRepoKey)
], FindFileRepo);
export { FindFileRepo };
