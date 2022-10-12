import { applyImmerToStateChange, applyDataElementRdtLogging } from "@domx/dataelement/middleware";
import { Router } from "@domx/router";
import { GoogleAnalytics } from "../domain/GoogleAnalytics";
import { sendFeedback } from "../layout/feedback";
import { NotFoundError, ServerError } from "./Errors";
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
    static { this.version = __APP_VERSION__; }
    static { this.isDev = import.meta.env.DEV; }
    static { this.isProd = import.meta.env.PROD; }
    static { this.isStorybook = import.meta.env.STORYBOOK ? true : false; }
    static get theme() { return localStorage.getItem("theme") || getSystemTheme(); }
    static set theme(theme) { localStorage.setItem("theme", theme); }
    static toggleTheme() {
        HbApp.theme = HbApp.theme === "light" ? "dark" : "light";
        updateHtmlTheme();
    }
    // want a predicate for live mode vs use mocks
    // what is a good name for this?
    // useFirebase: true?
    // 
    static init() {
        handleApplicationErrors();
        applyImmerToStateChange();
        applyDataElementRdtLogging();
        updateHtmlTheme();
        if (!this.isStorybook) {
            GoogleAnalytics.init();
        }
    }
}
const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";
const updateHtmlTheme = () => {
    const htmlEl = document.querySelector("html");
    htmlEl?.classList.remove(`dark-theme`);
    htmlEl?.classList.remove(`light-theme`);
    htmlEl?.classList.add(`${HbApp.theme}-theme`);
};
const handleApplicationErrors = () => {
    window.addEventListener("error", (event) => {
        if (event.error instanceof NotFoundError) {
            Router.replaceUrl("/not-found");
            console.error("Not Found Error:", event.error.message, { stack: event.error.stack });
            event.preventDefault();
        }
        else if (event.error instanceof ServerError) {
            const message = `Server Error: ${event.error.message}`;
            sendFeedback({ message });
            console.error(message, { stack: event.error.stack });
            event.preventDefault();
        }
    });
};
