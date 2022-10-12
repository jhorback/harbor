import { ClientError } from "./Errors";
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
export class HbCurrentUser {
    static { this._userRole = UserRole.none; }
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
