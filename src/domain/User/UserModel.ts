import { QueryDocumentSnapshot, Timestamp } from "firebase/firestore";
import { IUserData } from "../interfaces/UserInterfaces";
import { UserRole } from "./UserRoles";


export class UserModel implements IUserData {
    constructor() {
        this.isAuthenticated = false;
        this.displayName = "";
    }

    isAuthenticated: boolean;
    uid: string|undefined;
    displayName: string | null;
    email?: string | null | undefined;
    photoURL?: string | null | undefined;
    firstLogin?: Date | undefined;
    lastLogin?: Date | undefined;
    role?: UserRole | null | undefined;

    static toFirestore(user:IUserData) {
        return {
            ...user,
            firstLogin: Timestamp.fromDate(user.firstLogin ?? new Date()),
            lastLogin: Timestamp.fromDate(user.lastLogin ?? new Date())
        };
    }

    static fromFirestore(snapshot: QueryDocumentSnapshot):IUserData {
        const dbUser = snapshot.data();
        return {
            ...dbUser,
            firstLogin: dbUser.firstLogin.toDate(),
            lastLogin: dbUser.lastLogin.toDate()
        } as IUserData;
    }
}