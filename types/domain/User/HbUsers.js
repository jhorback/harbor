import { doc, getDoc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { HbDb } from "../HbDb";
import { UserRole } from "./UserRoles";
class HbUser {
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
export class HbUsers {
    static async updateUser(userId) {
    }
    static async getSignedInUser(authUser) {
        const docRef = doc(HbDb.current, "users", authUser.uid).withConverter(HbUser);
        const docSnap = await getDoc(docRef);
        let user;
        if (!docSnap.exists()) {
            user = {
                isAuthenticated: true,
                email: authUser.email,
                photoURL: authUser.photoURL,
                displayName: authUser.displayName,
                uid: authUser.uid,
                firstLogin: new Date(),
                lastLogin: new Date(),
                role: UserRole.none
            };
            await setDoc(doc(HbDb.current, "users", authUser.uid), user);
        }
        else {
            user = docSnap.data();
            user.lastLogin = new Date();
            await updateDoc(docRef, {
                lastLogin: user.lastLogin
            });
        }
        return user;
    }
}
// if (docSnap.exists()) {
//   console.log("Document data:", docSnap.data());
// } else {
//   // doc.data() will be undefined in this case
//   console.log("No such document!");
// }
