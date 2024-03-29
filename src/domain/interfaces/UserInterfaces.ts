import { UserRole } from "../User/UserRoles";


/*
FYI - to declare a function type can use
type MyFunctionType = (name: string) => number;
*/

export interface IHbAppInfo {
    version: string;
}


export const UserAuthKey:symbol = Symbol("USER_AUTH");


export interface IUserAuth {
    connect(): void;
    signOut(): Promise<void>;
}

export const UserListRepoKey:symbol = Symbol("USER_LIST_REPO");

export interface IUserListRepo {
    getUsers(): Promise<Array<IUserData>>;
    updateUserRole(uid:string, role:UserRole): Promise<void>
    getUser(uid:string): Promise<IUserData|null>
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
