import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { CurrentUserData } from "../hb-current-user-data";
import { IUserData } from "../domain/interfaces/UserInterfaces";
import { linkProp } from "@domx/linkprop";
import "./hb-avatar-button";
import { HbApp } from "../domain/HbApp";


/**
 * @class AppBar
 */
@customElement('hb-app-bar')
export class AppBar extends LitElement {

  @property({type: Object})
  currentUser:IUserData = CurrentUserData.defaultCurrentUser;

  connectedCallback() {
    super.connectedCallback();
  }

  render() {
    return html`
      <hb-current-user-data
          @current-user-changed=${linkProp(this, "currentUser")}
      ></hb-current-user-data>
      <div class="app-bar">
        <div class="logo">
          <a href="/">
            <img src=${`/theme/${HbApp.harborTheme}/logo-${HbApp.theme}.svg`}>
          </a>
        </div>
        <slot name="buttons"></slot>
        ${this.currentUser.isAuthenticated ? html`
          <hb-avatar-button href=${this.currentUser.photoURL}></hb-avatar-button>
        ` : ``}
      </div>
    `
  }

  static styles = [css`
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
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-app-bar': AppBar
  }
}
