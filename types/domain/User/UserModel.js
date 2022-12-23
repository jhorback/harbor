import { Timestamp } from "firebase/firestore";
export class UserModel {
    constructor() {
        this.isAuthenticated = false;
        this.displayName = "";
    }
    static toFirestore(user) {
        return {
            ...user,
            firstLogin: Timestamp.fromDate(user.firstLogin ?? new Date()),
            lastLogin: Timestamp.fromDate(user.lastLogin ?? new Date())
        };
    }
    static fromFirestore(snapshot) {
        const dbUser = snapshot.data();
        return {
            ...dbUser,
            firstLogin: dbUser.firstLogin.toDate(),
            lastLogin: dbUser.lastLogin.toDate()
        };
    }
}
