import { IHarborConfig } from "./src/IHarborConfig";



export const getHarborConfig = (appVersion:string, projectId:string):IHarborConfig => {
    const config = configs[projectId];
    if (!config) {
        throw new Error(`The harbor.config was not found for the projectId: ${projectId}`);
    }
    
    return {
        ...config,
        appVersion
    };
}; 


const haborConfg:IHarborConfig = {
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


interface IHarborConfigs { [key: string]: IHarborConfig }
const configs:IHarborConfigs = {
    "harbor-dev": haborConfg,
    "larisahorback-prod": {
        ...haborConfg,
        applicationTitle: "Larisa Horback",
        harborTheme: "larisa"
    }
};