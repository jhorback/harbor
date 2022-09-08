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

export interface IUserDataPermissions {
    isAuthor:Boolean;
    isSysAdmin: Boolean;
}