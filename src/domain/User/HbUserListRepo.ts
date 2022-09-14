import { getDocs, collection, QueryDocumentSnapshot, doc, updateDoc } from "firebase/firestore";
import { provides } from "../DependencyContainer/decorators";
import { HbApp } from "../HbApp";
import { HbDb } from "../HbDb";
import { IUserData, IUserListRepo, IUserListRepoKey } from "../interfaces/UserInterfaces";
import { UserModel } from "./UserModel";
import { UserRole } from "./UserRoles";



@provides<IUserListRepo>(IUserListRepoKey, !HbApp.isStorybook)
class HbUserListRepo implements IUserListRepo {
    async getUsers(): Promise<IUserData[]> {
        const query = await getDocs(collection(HbDb.current, "users").withConverter(UserModel));
        const users = query.docs.map((doc:QueryDocumentSnapshot<IUserData>) => doc.data());
        return users;
    }

    async updateUserRole(uid:string, role:UserRole): Promise<void> {
        const docRef = doc(HbDb.current, "users", uid).withConverter<IUserData>(UserModel);
        await updateDoc(docRef, {
            role
        });
    }
}