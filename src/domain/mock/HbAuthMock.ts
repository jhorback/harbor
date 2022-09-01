import { IUserAuth, IUserAuthKey, IUserData } from "../interfaces/UserInterfaces";
import dc from "../DependencyContainer";




// todo: use the decorator
class HbAutMock implements IUserAuth {

    constructor() {
       
    }

    connect(): void {
        console.log("CONNECTING FROM HbAuth Mock")
;        // set up listener then dispatch event
    }
}
dc.register<IUserAuth>(IUserAuthKey, HbAutMock);



