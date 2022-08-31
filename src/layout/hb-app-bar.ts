import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import "./hb-avatar-button";


/**
 * @class AppBar
 */
@customElement('hb-app-bar')
export class AppBar extends LitElement {

  render() {
    return html`
      <div class="app-bar">
        <div class="logo">
          <a href="/">
            <img src="theme/harbor/harbor-moon.svg">
          </a>
        </div>
        <slot name="buttons"></slot>
        <hb-avatar-button href="content/avatars/user1.png"></hb-avatar-button>
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
