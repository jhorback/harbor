


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
}


export interface IUserData {
    uid: string;
    displayName: string;
    email?: string;
    photoURL?: string;
    providerDisplayName?: string;
    firstLogin?: Date,
    lastLogin?: Date,
    permissions: IUserDataPermissions
}

export interface IUserDataPermissions {
    isAuthor:Boolean;
    isSysAdmin: Boolean;
}