export const roleHasAction = (role, action) => UserActionRoles[action].includes(role);
export var UserRole;
(function (UserRole) {
    UserRole["none"] = "NONE";
    UserRole["userAdmin"] = "USER_ADMIN";
    UserRole["author"] = "AUTHOR";
    UserRole["siteAdmin"] = "SITE_ADMIN";
})(UserRole || (UserRole = {}));
export var UserAction;
(function (UserAction) {
    /** create documents and access to profile documents tab */
    UserAction["authorDocuments"] = "AUTHOR_DOCUMENTS";
    /** in documents list and private documents */
    UserAction["viewAllDocuments"] = "VIEW_ALL_DOCUMENTS";
    /** allows user to edit any document */
    UserAction["editAnyDocument"] = "EDIT_ANY_DOCUMENT";
    /** allows user to delete their own documents */
    UserAction["deleteDocuments"] = "DELETE_DOCUMENTS";
    /** allows user to delete any document */
    UserAction["deleteAnyDocument"] = "DELETE_ANY_DOCUMENT";
    /** allows user to upload files and access to the profile content tab */
    UserAction["uploadContent"] = "UPLOAD_CONTENT";
    /** allows user to view all content */
    UserAction["viewAllContent"] = "VIEW_ALL_CONTENT";
    /** allows user to delete their own content */
    UserAction["deleteContent"] = "DELETE_CONTENT";
    /** allows user to delete any content */
    UserAction["deleteAnyContent"] = "DELETE_ANY_CONTENT";
    /** allows a user to view all user in the profile users tab */
    UserAction["viewUsers"] = "VIEW_USERS";
    /** allows a user to edit any users role */
    UserAction["editUsersRoles"] = "EDIT_USERS_ROLES";
    /** allows a user to change the home page */
    UserAction["editSiteSettings"] = "EDIT_SITE_SETTINGS";
})(UserAction || (UserAction = {}));
const UserActionRoles = {
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
