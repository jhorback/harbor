export const userCan = (user, action) => UserActionRoles[action].includes(user.role ? user.role : UserRole.none);
export var UserRole;
(function (UserRole) {
    UserRole["none"] = "NONE";
    UserRole["userAdmin"] = "USER_ADMIN";
    UserRole["author"] = "AUTHOR";
    UserRole["siteAdmin"] = "SITE_ADMIN";
})(UserRole || (UserRole = {}));
export var UserAction;
(function (UserAction) {
    UserAction["authorDocuments"] = "AUTHOR_DOCUMENTS";
    UserAction["viewAllDocuments"] = "VIEW_ALL_DOCUMENTS";
    UserAction["editAnyDocument"] = "EDIT_ANY_DOCUMENT";
    UserAction["deleteDocuments"] = "DELETE_DOCUMENTS";
    UserAction["deleteAnyDocument"] = "DELETE_ANY_DOCUMENT";
    UserAction["uploadContent"] = "UPLOAD_CONTENT";
    UserAction["viewAllContent"] = "VIEW_ALL_CONTENT";
    UserAction["deleteContent"] = "DELETE_CONTENT";
    UserAction["deleteAnyContent"] = "DELETE_ANY_CONTENT";
    UserAction["viewUsers"] = "VIEW_USERS";
    UserAction["editUsersRoles"] = "EDIT_USERS_ROLES";
    UserAction["editSiteSettings"] = "EDIT_SITE_SETTINGS";
})(UserAction || (UserAction = {}));
// export const userCanAction = (user:IUserData) => (action:UserAction) =>
//     UserActionRoles[action].includes(user.role ? user.role : UserRole.none);
// todo: fill out action roles (rename?), review implementation
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
