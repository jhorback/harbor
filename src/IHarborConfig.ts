import { FirebaseOptions } from "firebase/app";

export interface IHarborConfig {
    appVersion?: string;
    harborTheme: string;
    applicationTitle: string;
    fbConfig:FirebaseOptions;
}