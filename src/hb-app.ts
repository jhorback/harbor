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
@customElement('hb-app')
export class HarborApp extends LitElement {

    @state()
    isInitialized = false;

    async connectedCallback() {
        super.connectedCallback();
        await HbApp.init();
        this.isInitialized = true;
    }

  render() {
    return html`
      <!-- Keeping this at the app level retains the
      user data in the dataelement store -->
      <hb-current-user-data></hb-current-user-data>
      <hb-feedback></hb-feedback>
      <div id="hb-app"></div>
      ${!this.isInitialized ? html`` : html`           
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

  static styles = [css`
    :host {
      display: block;
    }
  `];
}


declare global {
  interface HTMLElementTagNameMap {
    'hb-app': HarborApp
  }
}
