
import { getAnalytics, Analytics, logEvent } from "firebase/analytics";
import { FbApp } from "./FbApp";


export class GoogleAnalytics {
    private static _current?:Analytics = undefined;

    static get current() {
        if (!GoogleAnalytics._current) {
            GoogleAnalytics._current = getAnalytics(FbApp.current);
        }
        return GoogleAnalytics._current;
    }
}

// logEvent(FbApp._analytics, "login", {"asdf":"asdf"});
// Analytics
// https://firebase.google.com/docs/analytics/get-started?platform=web
// Events to log
// https://support.google.com/analytics/answer/9267735?hl=en&ref_topic=9756175
// login, search, select_content