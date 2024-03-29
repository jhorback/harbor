var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, state } from "lit/decorators.js";
import { HbApp } from "./domain/HbApp";
import "@domx/router/domx-route";
import "@domx/router/domx-route-not-found";
import "./app/hb-route-not-found-page";
import "./app/profile/hb-profile-page";
import "./app/hb-about-page";
import "./hb-current-user-data";
import "./layout/feedback/hb-feedback";
/**
 *
 */
let HarborApp = class HarborApp extends LitElement {
    constructor() {
        super(...arguments);
        this.isInitialized = false;
    }
    async connectedCallback() {
        super.connectedCallback();
        await HbApp.init();
        this.isInitialized = true;
    }
    render() {
        return html `
      <!-- Keeping this at the app level retains the
      user data in the dataelement store -->
      <hb-current-user-data></hb-current-user-data>
      <hb-feedback></hb-feedback>
      <div id="hb-app"></div>
      ${!this.isInitialized ? html `` : html `           
            <domx-route
                pattern="/profile(/*tail)"
                element="hb-profile-page"
                append-to="#hb-app"
            ></domx-route>
            <domx-route
                pattern="/app/about"
                element="hb-about-page"          
                append-to="#hb-app"
            ></domx-route>
            <domx-route
                pattern="/not-found"
                element="hb-route-not-found-page"
                append-to="#hb-app"
            ></domx-route>
            <domx-route-not-found
                element="hb-page-renderer"
                append-to="#hb-app"
            ></domx-route-not-found>
        `}
      `;
    }
    static { this.styles = [css `
    :host {
      display: block;
    }
  `]; }
};
__decorate([
    state()
], HarborApp.prototype, "isInitialized", void 0);
HarborApp = __decorate([
    customElement('hb-app')
], HarborApp);
export { HarborApp };
