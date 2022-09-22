import { ClientError } from "./ClientError";
import { UserAction, roleHasAction, UserRole } from "./User/UserRoles";
export { UserAction };
/**
 * Returns true if the current user is authorized
 * to perform the specified action.
 */
export const isAuthorized = (action) => {
    return new HbCurrentUser().authorize(action);
};
/**
 * A decorator for a final authorization check on repo methods.
 * This will throw an {@link ClientError} if the user is
 * not authorized for the specified action.
 */
export const authorize = (action) => {
    return (target, propertyKey, descriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (...args) {
            if (isAuthorized(action) === false) {
                throw new ClientError("You do not have permission to perform this action");
            }
            return originalMethod.apply(this, args);
        };
    };
};
// TODO: create a method and decorator for the UI components
// that call into this class for role checking in lieu of UserRoles->canUse?
// trying to see if I can store the user role in the token so I can get it here
// create:
// @authorize(UserAction) decorator for Repo methods
// isAuthorized(UserAction) lit directive for UI components
// both should call into the "authorize" method here
export class HbCurrentUser {
    static setCurrentUser(uid, userRole) {
        this._uid = uid;
        this._userRole = userRole || UserRole.none;
    }
    get uid() {
        return HbCurrentUser._uid;
    }
    get userRole() {
        return HbCurrentUser._userRole;
    }
    authorize(action) {
        return roleHasAction(HbCurrentUser._userRole, action);
    }
}
HbCurrentUser._userRole = UserRole.none;
