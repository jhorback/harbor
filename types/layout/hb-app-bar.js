var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CurrentUserData } from "../hb-current-user-data";
import { linkProp } from "@domx/linkprop";
import "./hb-avatar-button";
import { HbApp } from "../domain/HbApp";
/**
 * @class AppBar
 */
let AppBar = class AppBar extends LitElement {
    constructor() {
        super(...arguments);
        this.currentUser = CurrentUserData.defaultCurrentUser;
    }
    connectedCallback() {
        super.connectedCallback();
    }
    render() {
        return html `
      <hb-current-user-data
          @current-user-changed=${linkProp(this, "currentUser")}
      ></hb-current-user-data>
      <div class="app-bar">
        <div class="logo">
          <a href="/">
            <img src=${`/theme/${HbApp.config.harborTheme}/logo-${HbApp.theme}.svg`}>
          </a>
        </div>
        <slot name="buttons"></slot>
        ${this.currentUser.isAuthenticated ? html `
          <hb-avatar-button href=${this.currentUser.photoURL}></hb-avatar-button>
        ` : ``}
      </div>
    `;
    }
    static { this.styles = [css `
    :host {
      display: block;
      height: 64px;
    }
    .app-bar {
      display: flex;
      align-items: center;
    }
    .app-bar .logo {
      flex-grow: 1;
    }
    .app-bar img {
      max-height: 50px;
      padding: 7px;
    }
    .app-bar hb-avatar-button {
      margin: 0 1rem;
    }
  `]; }
};
__decorate([
    property({ type: Object })
], AppBar.prototype, "currentUser", void 0);
AppBar = __decorate([
    customElement('hb-app-bar')
], AppBar);
export { AppBar };
