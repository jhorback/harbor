var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { deleteDoc, doc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { DeletePageRepoKey } from "../interfaces/PageInterfaces";
import { authorize, UserAction } from "../HbCurrentUser";
let DeletePageRepo = class DeletePageRepo {
    async deletePage(uid) {
        await deleteDoc(doc(HbDb.current, "pages", uid));
    }
};
__decorate([
    authorize(UserAction.authorPages)
], DeletePageRepo.prototype, "deletePage", null);
DeletePageRepo = __decorate([
    provides(DeletePageRepoKey, !HbApp.isStorybook)
], DeletePageRepo);
