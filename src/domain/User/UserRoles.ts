
export const roleHasAction = (role:UserRole, action:UserAction): boolean => 
    UserActionRoles[action].includes(role);


    
export enum UserRole {
    none = "NONE",
    userAdmin = "USER_ADMIN",
    author = "AUTHOR",
    siteAdmin = "SITE_ADMIN"
}


export enum UserAction {
    /** use for testing */
    none = "NONE",
    /** create pages and access to profile pages tab */
    authorPages =       "AUTHOR_PAGES",
    /** in pages list and private pages */
    viewAllPages =      "VIEW_ALL_PAGES",
    /** allows user to edit any page */
    editAnyPage =       "EDIT_ANY_PAGE",
    /** allows user to delete their own pages */
    deletePages =       "DELETE_PAGES",
    /** allows user to delete any page */
    deleteAnyPage =     "DELETE_ANY_PAGE",
    /** allows user to upload files and access to the profile files tab */
    uploadFiles =           "UPLOAD_FILES",
    /** allows user to view all files */
    viewAllFiles =          "VIEW_ALL_FILES",
    /** allows user to delete their own files */
    deleteFiles =           "DELETE_FILES",
    /** allows user to delete any file */
    deleteAnyFile =         "DELETE_ANY_FILE",
    /** allows a user to view all user in the profile users tab */
    viewUsers =             "VIEW_USERS",
    /** allows a user to edit any users role */
    editUsersRoles =        "EDIT_USERS_ROLES",
    /** allows a user to change the home page */
    editSiteSettings =      "EDIT_SITE_SETTINGS"
}



const UserActionRoles:{[key:string]: Array<UserRole>} = {
    [UserAction.none]: [],
    [UserAction.authorPages]: [
        UserRole.userAdmin,
        UserRole.author,
        UserRole.siteAdmin
    ],
    [UserAction.viewAllPages]: [
        UserRole.siteAdmin
    ],
    [UserAction.editAnyPage]: [
        UserRole.siteAdmin
    ],
    [UserAction.deletePages]: [
        UserRole.userAdmin,
        UserRole.author,
        UserRole.siteAdmin
    ],
    [UserAction.deleteAnyPage]: [
        UserRole.siteAdmin
    ],
    [UserAction.uploadFiles]: [
        UserRole.userAdmin,
        UserRole.author,
        UserRole.siteAdmin
    ],
    [UserAction.viewAllFiles]: [
        UserRole.siteAdmin
    ],
    [UserAction.deleteFiles]: [
        UserRole.userAdmin,
        UserRole.author,
        UserRole.siteAdmin
    ],
    [UserAction.deleteAnyFile]: [
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
