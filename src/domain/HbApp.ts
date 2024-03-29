import {
    applyImmerToStateChange,
    applyDataElementRdtLogging
} from "@domx/dataelement/middleware";
import { connectRdtLogger } from "@domx/statecontroller";
import { Router } from "@domx/router";
import { GoogleAnalytics } from "../domain/GoogleAnalytics";
import { sendFeedback } from "../layout/feedback";
import { NotFoundError, ServerError } from "./Errors";
import { IHarborConfig } from "../IHarborConfig";


/**
 * This is defined in the vite.config.ts
 */
declare const __HARBOR_CONFIG__: IHarborConfig;



/**
 * A class with static properties containing the app version
 * and other environment variables.
 * 
 * If wanting to add additional environment variables see:
 * https://vitejs.dev/guide/env-and-mode.html#env-files
 * 
 * Note: .env files are also supported in storybook:
 * https://storybook.js.org/docs/react/configure/environment-variables
 */
export class HbApp {
    static config:IHarborConfig = __HARBOR_CONFIG__;
    static isDev = import.meta.env.DEV;
    static isProd = import.meta.env.PROD;
    static isStorybook = import.meta.env.STORYBOOK ? true : false;
    static get theme() { return localStorage.getItem("theme") || getSystemTheme(); }
    static set theme(theme:string) { localStorage.setItem("theme", theme )}
    static toggleTheme() {
        HbApp.theme = HbApp.theme === "light" ? "dark" : "light";
        updateHtmlTheme();
    } 

    static async init() {
        handleApplicationErrors();
        applyImmerToStateChange();
        applyDataElementRdtLogging();
        connectRdtLogger("HARBOR-APP");
        updateHtmlTheme();
        if (!this.isStorybook) {
            GoogleAnalytics.init();
        }
        /**
         * import all doc pages and content
         * In the future, can create a module to import
         * dynamic packages based on system settings
         */
        await import("../pages/index");
    }

    static setPageTitle(title?:string) {
        const appTitle = HbApp.config.applicationTitle;
        document.title = title ? `${title} - ${appTitle}` : appTitle;
    }
}


const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

const updateHtmlTheme = () => {   
    const bodyEl = document.querySelector("body");
    bodyEl?.classList.remove(`dark-theme`);
    bodyEl?.classList.remove(`light-theme`);    
    bodyEl?.classList.add(`${HbApp.theme}-theme`);
};


const handleApplicationErrors = () => {
    window.addEventListener("error", (event:ErrorEvent) =>
        tryHandleErrorEvent(event, event.error));

    window.addEventListener("unhandledrejection", (event:PromiseRejectionEvent) =>
        tryHandleErrorEvent(event, event.reason));
};

const tryHandleErrorEvent = (event:Event, error:Error) => {
    if (error instanceof NotFoundError) {

        Router.replaceUrl("/not-found");
        console.error("Not Found Error:", error.message, {stack: error.stack});
        event.preventDefault();

    } else if (error instanceof ServerError) {

        const message = `Server Error: ${error.message}`;
        sendFeedback({ message });
        console.error(message, {stack: error.stack});
        event.preventDefault();
    }
};