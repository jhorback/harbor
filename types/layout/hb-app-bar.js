var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "./hb-avatar-button";
/**
 * @class AppBar
 */
let AppBar = class AppBar extends LitElement {
    render() {
        return html `
      <div class="app-bar">
        <div class="logo">
          <a href="/">
            <img src="theme/harbor/harbor-moon.svg">
          </a>
        </div>
        <slot name="buttons"></slot>
        <hb-avatar-button href="content/avatars/user1.png"></hb-avatar-button>
      </div>
    `;
    }
};
AppBar.styles = [css `
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
  `];
AppBar = __decorate([
    customElement('hb-app-bar')
], AppBar);
export { AppBar };
