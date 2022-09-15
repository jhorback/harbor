import { IUserData } from "../interfaces/UserInterfaces";


export const userCan = (user:IUserData, action:UserAction):boolean =>
    UserActionRoles[action].includes(user.role ? user.role : UserRole.none);

    
export enum UserRole {
    none = "NONE",
    userAdmin = "USER_ADMIN",
    author = "AUTHOR",
    siteAdmin = "SITE_ADMIN"
}


export enum UserAction {
    authorDocuments =       "AUTHOR_DOCUMENTS",         // create documents and access to documents tab
    viewAllDocuments =      "VIEW_ALL_DOCUMENTS",       // in documents list and private documents
    editAnyDocument =       "EDIT_ANY_DOCUMENT",        
    deleteDocuments =       "DELETE_DOCUMENTS",
    deleteAnyDocument =     "DELETE_ANY_DOCUMENT",
    uploadContent =         "UPLOAD_CONTENT",
    viewAllContent =        "VIEW_ALL_CONTENT",
    deleteContent =         "DELETE_CONTENT",
    deleteAnyContent =      "DELETE_ANY_CONTENT",
    viewUsers =             "VIEW_USERS",
    editUsersRoles =        "EDIT_USERS_ROLES",
    editSiteSettings =      "EDIT_SITE_SETTINGS"
}




// export const userCanAction = (user:IUserData) => (action:UserAction) =>
//     UserActionRoles[action].includes(user.role ? user.role : UserRole.none);


// jch: fill out action roles (rename?), review implementation
const UserActionRoles:{[key:string]: Array<UserRole>} = {
    [UserAction.authorDocuments]: [
        UserRole.userAdmin,
        UserRole.author,
        UserRole.siteAdmin
    ],
    [UserAction.viewAllDocuments]: [
        UserRole.siteAdmin
    ],
    [UserAction.editAnyDocument]: [
        UserRole.siteAdmin
    ],
    [UserAction.deleteDocuments]: [
        UserRole.userAdmin,
        UserRole.author,
        UserRole.siteAdmin
    ],
    [UserAction.deleteAnyDocument]: [
        UserRole.siteAdmin
    ],
    [UserAction.uploadContent]: [
        UserRole.userAdmin,
        UserRole.author,
        UserRole.siteAdmin
    ],
    [UserAction.viewAllContent]: [
        UserRole.siteAdmin
    ],
    [UserAction.deleteContent]: [
        UserRole.userAdmin,
        UserRole.author,
        UserRole.siteAdmin
    ],
    [UserAction.deleteAnyContent]: [
        UserRole.siteAdmin
    ],
    [UserAction.viewUsers]: [
        UserRole.userAdmin,
        UserRole.siteAdmin
    ],
    [UserAction.editUsersRoles]: [
        UserRole.userAdmin,
        UserRole.siteAdmin
    ],
    [UserAction.editSiteSettings]: [
        UserRole.siteAdmin
    ]
};
