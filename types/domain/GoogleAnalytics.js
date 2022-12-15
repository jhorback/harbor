import { getAnalytics } from "firebase/analytics";
import { FbApp } from "./FbApp";
export class GoogleAnalytics {
    static { this._current = undefined; }
    static get current() {
        GoogleAnalytics.init();
        return GoogleAnalytics._current;
    }
    static init() {
        if (!GoogleAnalytics._current) {
            GoogleAnalytics._current = getAnalytics(FbApp.current);
        }
    }
}
// logEvent(FbApp._analytics, "login", {"asdf":"asdf"});
// Analytics
// https://firebase.google.com/docs/analytics/get-started?platform=web
// Events to log
// https://support.google.com/analytics/answer/9267735?hl=en&ref_topic=9756175
// login, search, select_content
