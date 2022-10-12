
export const roleHasAction = (role:UserRole, action:UserAction): boolean => 
    UserActionRoles[action].includes(role);


    
export enum UserRole {
    none = "NONE",
    userAdmin = "USER_ADMIN",
    author = "AUTHOR",
    siteAdmin = "SITE_ADMIN"
}


export enum UserAction {
    /** create documents and access to profile documents tab */
    authorDocuments =       "AUTHOR_DOCUMENTS",
    /** in documents list and private documents */
    viewAllDocuments =      "VIEW_ALL_DOCUMENTS",
    /** allows user to edit any document */
    editAnyDocument =       "EDIT_ANY_DOCUMENT",
    /** allows user to delete their own documents */
    deleteDocuments =       "DELETE_DOCUMENTS",
    /** allows user to delete any document */
    deleteAnyDocument =     "DELETE_ANY_DOCUMENT",
    /** allows user to upload files and access to the profile content tab */
    uploadContent =         "UPLOAD_CONTENT",
    /** allows user to view all content */
    viewAllContent =        "VIEW_ALL_CONTENT",
    /** allows user to delete their own content */
    deleteContent =         "DELETE_CONTENT",
    /** allows user to delete any content */
    deleteAnyContent =      "DELETE_ANY_CONTENT",
    /** allows a user to view all user in the profile users tab */
    viewUsers =             "VIEW_USERS",
    /** allows a user to edit any users role */
    editUsersRoles =        "EDIT_USERS_ROLES",
    /** allows a user to change the home page */
    editSiteSettings =      "EDIT_SITE_SETTINGS"
}



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
