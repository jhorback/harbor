import { UserRole } from "../User/UserRoles";


/*
FYI - to declare a function type can use
type MyFunctionType = (name: string) => number;
*/

export interface IHbAppInfo {
    version: string;
}


export const IUserAuthKey:symbol = Symbol("USER_AUTH");


export interface IUserAuth {
    connect(): void;
    signOut(): Promise<void>;
}

export const IUserListRepoKey:symbol = Symbol("USER_LIST_REPO");

export interface IUserListRepo {
    getUsers(): Promise<Array<IUserData>>;
    updateUserRole(uid:string, role:UserRole): Promise<void>
}


export interface IUserData {
    isAuthenticated: boolean;
    uid?: string;
    displayName: string|null;
    email?: string|null;
    photoURL?: string|null;
    firstLogin?: Date,
    lastLogin?: Date,
    role?: UserRole|null
}
