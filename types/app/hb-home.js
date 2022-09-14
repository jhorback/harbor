var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import "../document/hb-doc-page";
import "../domain/HomePage/HbHomePageRepo";
import { inject } from "../domain/DependencyContainer/decorators";
import { IHomePageRepoKey } from "../domain/interfaces/DocumentInterfaces";
import { sendFeedback } from "../common/feedback";
import { docTypes } from "../document/docTypes";
/**
 * The job of this element is to look the home page
 * document up in the database and append the correct element to the dom
 */
let HbHome = class HbHome extends LitElement {
    async connectedCallback() {
        super.connectedCallback();
        const homePageRef = await this.homePageRepo.getHomePageRef();
        // alert if no home page set
        if (homePageRef === null) {
            this.showNotFound();
            sendFeedback({
                message: "The home page is not configured",
                actionText: "Settings",
                actionHref: "/profile/admin"
            });
            return;
        }
        // verify the custom element has been defined
        const el = docTypes[homePageRef.doctype].element;
        if (customElements.get(el) === undefined) {
            console.log(`The docType element was not defined: ${el}`);
            this.showNotFound();
            return;
        }
        this.showDocElement(el, homePageRef.uid);
    }
    showDocElement(el, uid) {
        const docEl = document.createElement(el);
        docEl.setAttribute("uid", uid);
        this.$homeContainer.innerHTML = "";
        this.$homeContainer.append(docEl);
    }
    showNotFound() {
        const notFoundEl = document.createElement("hb-route-not-found-page");
        this.$homeContainer.innerHTML = "";
        this.$homeContainer.append(notFoundEl);
    }
    render() {
        return html `
            <div id="home-container">
                <hb-doc-page uid="doc:home"></hb-doc-page>
            </div>            
        `;
    }
};
HbHome.styles = [css `
        :host {
            display: block;
        }
    `];
__decorate([
    inject(IHomePageRepoKey)
], HbHome.prototype, "homePageRepo", void 0);
__decorate([
    query("#home-container")
], HbHome.prototype, "$homeContainer", void 0);
HbHome = __decorate([
    customElement('hb-home')
], HbHome);
export { HbHome };
