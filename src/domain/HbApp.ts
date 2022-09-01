import {
    applyImmerToStateChange,
    applyDataElementRdtLogging
} from "@domx/dataelement/middleware";


/**
 * This is defined in the vite.config.ts
 * what line is this?
 */
declare const __APP_VERSION__: string;



export class HbApp {
    static version:string = __APP_VERSION__;

    static init() {
        applyImmerToStateChange();
        applyDataElementRdtLogging();
    }
}