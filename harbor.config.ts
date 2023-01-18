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

const larisaHorbackConfig:IHarborConfig = {
    harborTheme: "larisa",
    applicationTitle: "larisa",
    fbConfig: {
        apiKey: "AIzaSyAKIHekhVF4ZSIZXFiePjJdmUqTUrDP46A",
        authDomain: "larisahorback-prod.firebaseapp.com",
        projectId: "larisahorback-prod",
        storageBucket: "larisahorback-prod.appspot.com",
        messagingSenderId: "826769733869",
        appId: "1:826769733869:web:c202b2e5cfb13a7dbc34e4",
        measurementId: "G-W5VSPFHS7P"
    }
};


interface IHarborConfigs { [key: string]: IHarborConfig }
const configs:IHarborConfigs = {
    "habor-dev": haborConfg,
    "larisahorback-prod": larisaHorbackConfig,
    "larisahorback-test": {
        ...haborConfg,
        applicationTitle: "Larisa Horback",
        harborTheme: "larisa"
    }
};