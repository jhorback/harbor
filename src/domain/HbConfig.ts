import { FirebaseOptions } from "firebase/app";



let location:Location;
let localHostName = "localhost";
localHostName = "larisahorback.com";


interface IHbConfigs { [key: string]: HbConfigOptions }

export interface HbConfigOptions {
    harborTheme: string,
    applicationTitle: string,
    fbConfig:FirebaseOptions;
}

const haborConfg:HbConfigOptions = {
    harborTheme: "harbor",
    applicationTitle: "Harbor",
    fbConfig: {
        apiKey: "AIzaSyB73OO_89iAKkx9Ti9SLQX4maRDbboRSmQ",
        authDomain: "habor-dev.firebaseapp.com",
        projectId: "habor-dev",
        storageBucket: "habor-dev.appspot.com",
        messagingSenderId: "365794000792",
        appId: "1:365794000792:web:74242342d0fc8b8613f5ed",
        measurementId: "G-Z2896W2VC8"
    }
};

const configs:IHbConfigs = {
    "habor-dev.firebaseapp.com": haborConfg,
    "localhost": {...haborConfg},
    "larisahorback.com": {...haborConfg, applicationTitle: "Larisa Horback", harborTheme: "larisa"}
};


export class HbConfig {
    static get currentHostName():string {
        const hostName = location ? location.hostname : localHostName;
        return hostName;
    }
    static get current() {
        return configs[HbConfig.currentHostName];
    }
}
