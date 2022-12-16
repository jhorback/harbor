var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { getDocs, collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { authorize, UserAction } from "../HbCurrentUser";
import { HbDb } from "../HbDb";
import { UserListRepoKey } from "../interfaces/UserInterfaces";
import { UserModel } from "./UserModel";
let HbUserListRepo = class HbUserListRepo {
    async getUsers() {
        const snapshot = await getDocs(collection(HbDb.current, "users").withConverter(UserModel));
        const users = snapshot.docs.map((doc) => doc.data());
        return users;
    }
    async updateUserRole(uid, role) {
        const docRef = doc(HbDb.current, "users", uid).withConverter(UserModel);
        await updateDoc(docRef, {
            role
        });
    }
    async getUser(uid) {
        const docRef = doc(HbDb.current, "users", uid).withConverter(UserModel);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : Promise.resolve(null);
    }
};
__decorate([
    authorize(UserAction.viewUsers)
], HbUserListRepo.prototype, "getUsers", null);
__decorate([
    authorize(UserAction.editUsersRoles)
], HbUserListRepo.prototype, "updateUserRole", null);
HbUserListRepo = __decorate([
    provides(UserListRepoKey, !HbApp.isStorybook)
], HbUserListRepo);
