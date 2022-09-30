import { ClientError } from "./ClientError";
import { UserAction, roleHasAction, UserRole } from "./User/UserRoles";
export { UserAction };

/**
 * Returns true if the current user is authorized
 * to perform the specified action.
 */
export const isAuthorized = (action:UserAction) => {
    return new HbCurrentUser().authorize(action);
};


/**
 * A decorator for a final authorization check on repo methods.
 * This will throw an {@link ClientError} if the user is
 * not authorized for the specified action.
 */
export const authorize = (action:UserAction) => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
        const originalMethod = descriptor.value;
        descriptor.value = function (this:any, ...args: any[]) {            
            if (isAuthorized(action) === false) {
                throw new ClientError("You do not have permission to perform this action");
            }
            return originalMethod.apply(this, args);
        };
    };
};


export class HbCurrentUser {

    private static _uid:string|undefined;
    private static _userRole:UserRole = UserRole.none;

    static setCurrentUser(uid:string|undefined, userRole: UserRole|undefined|null) {
        this._uid = uid;
        this._userRole = userRole || UserRole.none;
    }

    get uid():string|undefined {
        return HbCurrentUser._uid;
    }

    get userRole():UserRole {
        return HbCurrentUser._userRole;
    }

    authorize(action:UserAction):boolean {
        return roleHasAction(HbCurrentUser._userRole, action);
    }
}