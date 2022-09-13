import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { HbApp } from "./domain/HbApp";
import "@domx/router/domx-route";
import "./app/hb-home";
import "./app/profile/hb-profile-page";
import "./app/hb-about-page";
import "./hb-current-user-data";
import "./common/feedback/hb-feedback";


HbApp.init();

/**
 * 
 */
@customElement('hb-app')
export class HarborApp extends LitElement {

  render() {
    return html`
      <!-- Keeping this at the app level retains the
      user data in the dataelement store -->
      <hb-current-user-data></hb-current-user-data>
      <hb-feedback></hb-feedback>
      <div id="hb-app"></div>
      <domx-route
          pattern="/"
          element="hb-home"
          append-to="#hb-app"
      ></domx-route>
      <domx-route
          pattern="/profile(/*tail)"
          element="hb-profile-page"
          append-to="#hb-app"
      ></domx-route>
      <domx-route
          pattern="/about"
          element="hb-about-page"          
          append-to="#hb-app"
      ></domx-route>
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
