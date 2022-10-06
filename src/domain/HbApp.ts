import {
    applyImmerToStateChange,
    applyDataElementRdtLogging
} from "@domx/dataelement/middleware";
import { Router } from "@domx/router";
import { GoogleAnalytics } from "../domain/GoogleAnalytics";
import { sendFeedback } from "../layout/feedback";
import { NotFoundError, ServerError } from "./Errors";


/**
 * This is defined in the vite.config.ts
 */
declare const __APP_VERSION__: string;


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
    static version:string = __APP_VERSION__;
    static isDev = import.meta.env.DEV;
    static isProd = import.meta.env.PROD;
    static isStorybook = import.meta.env.STORYBOOK ? true : false;

    // want a predicate for live mode vs use mocks
    // what is a good name for this?
    // useFirebase: true?
    // 

    static init() {
        handleApplicationErrors();
        applyImmerToStateChange();
        applyDataElementRdtLogging();
        if (!this.isStorybook) {
            GoogleAnalytics.init();
        }
    }
}


const handleApplicationErrors = () => {
    window.addEventListener("error", (event:ErrorEvent) => {
        if (event.error instanceof NotFoundError) {
          Router.replaceUrl("/not-found");
          console.error("Not Found Error:", event.error.message, {stack: event.error.stack});
          event.preventDefault();
        } else if (event.error instanceof ServerError) {
          const message = `Server Error: ${event.error.message}`;
          sendFeedback({ message });
          console.error(message, {stack: event.error.stack});
          event.preventDefault();
        }
    });
}