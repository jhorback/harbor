import { IUserAuth, IUserAuthKey, IUserData } from "../interfaces/UserInterfaces";
import {provides} from "../DependencyContainer/decorators";




@provides<IUserAuth>(IUserAuthKey)
class HbAutMock implements IUserAuth {

    constructor() {
       
    }

    connect(): void {
        console.log("CONNECTING FROM HbAuth Mock");
        // set up listener then dispatch event
        // todo: fill out hbauthmock
  }
}



