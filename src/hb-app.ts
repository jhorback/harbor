import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { HbApp } from "./domain/HbApp";
import "@domx/router/domx-route";
import "@domx/router/domx-route-not-found";
import "./app/hb-route-not-found-page";
import "./app/hb-home";
import "./app/profile/hb-profile-page";
import "./app/hb-about-page";
import "./doc/hb-doc-page";
import "./hb-current-user-data";
import "./layout/feedback/hb-feedback";
import { docTypes } from "./domain/Doc/docTypes";


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
      <domx-route-not-found
          element="hb-route-not-found-page"
          append-to="#hb-app"
      ></domx-route-not-found>
      <domx-route
          pattern="/not-found"
          element="hb-route-not-found-page"          
          append-to="#hb-app"
      ></domx-route>
      ${docTypes.all().map(type => html`
        <domx-route
          pattern=${`${type.route}/:pid`}
          element=${type.element}
          append-to="#hb-app"
        ></domx-route>
      `)}
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
