var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import "../domain/SystemAdmin/HbHomePageRepo";
import { inject } from "../domain/DependencyContainer/decorators";
import { HomePageRepoKey } from "../domain/interfaces/DocumentInterfaces";
import { sendFeedback } from "../layout/feedback";
import { docTypes } from "../domain/Doc/docTypes";
/**
 * The job of this element is to look the home page
 * document up in the database and append the correct element to the dom
 *
 * // TODO: use the hb-system-admin-data to load the homePageRef
 * Basically, remove the local storage and extra logic from here
 */
let HbHome = class HbHome extends LitElement {
    async connectedCallback() {
        super.connectedCallback();
        // need to wait since the element needs to render
        // the home-container
        await this.updateComplete;
        const homePageRef = this.getHomePageFromLocalStorage();
        if (homePageRef) {
            this.showHomePage(homePageRef);
        }
        const dbHomePageRef = await this.homePageRepo.getHomePageRef();
        if (!homePageRef || homePageRef.uid !== dbHomePageRef?.uid) {
            this.showHomePage(dbHomePageRef);
            localStorage.setItem("homePageRef", JSON.stringify(dbHomePageRef));
        }
    }
    getHomePageFromLocalStorage() {
        const homePageRefStr = localStorage.getItem("homePageRef");
        if (!homePageRefStr) {
            return null;
        }
        try {
            return JSON.parse(homePageRefStr);
        }
        catch {
            return null;
        }
    }
    showHomePage(homePageRef) {
        if (homePageRef === null) {
            this.showNotFound("The home page is not configured");
            sendFeedback({
                message: "The home page is not configured",
                actionText: "Settings",
                actionHref: "/profile/admin"
            });
            return;
        }
        // verify the docType exists
        const docType = docTypes.get(homePageRef.docType);
        if (!docType) {
            this.showNotFound(`The docType was not found: ${homePageRef.docType}`);
            return;
        }
        // verify the custom element has been defined
        const el = docType.element;
        if (customElements.get(el) === undefined) {
            this.showNotFound(`The docType element was not defined: ${el}`);
            return;
        }
        this.showDocElement(el, homePageRef.pid);
    }
    showDocElement(el, pid) {
        const docEl = document.createElement(el);
        docEl.setAttribute("pid", pid);
        this.$homeContainer.innerHTML = "";
        this.$homeContainer.append(docEl);
    }
    showNotFound(warn) {
        console.warn(warn);
        const notFoundEl = document.createElement("hb-route-not-found-page");
        this.$homeContainer.innerHTML = "";
        this.$homeContainer.append(notFoundEl);
    }
    render() {
        return html `
            <div id="home-container">
                Loading... can store in local storage and then check db to see if home is different.
            </div>            
        `;
    }
    static { this.styles = [css `
        :host {
            display: block;
        }
    `]; }
};
__decorate([
    inject(HomePageRepoKey)
], HbHome.prototype, "homePageRepo", void 0);
__decorate([
    query("#home-container")
], HbHome.prototype, "$homeContainer", void 0);
HbHome = __decorate([
    customElement('hb-home')
], HbHome);
export { HbHome };
