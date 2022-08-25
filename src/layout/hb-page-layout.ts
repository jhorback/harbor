import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "./hb-app-bar";
import { UserMenu } from "./hb-user-menu";


/**
 * @class PageLayout
 */
@customElement('hb-page-layout')
export class PageLayout extends LitElement {

    @query("hb-user-menu")
    $userMenu!: UserMenu;

  render() {
    return html`
      <hb-app-bar
        @hb-avatar-button-click=${this.avatarButtonClicked}
      >
        <div slot="buttons">
            <slot name="app-bar-buttons"></slot>
        </div>
      </hb-app-bar>
      <hb-user-menu></hb-user-menu>
      <slot></slot>
    `
  }

  avatarButtonClicked() {
    this.$userMenu.open = !this.$userMenu.open;
  }

  static styles = [css`
    :host {
      display: block;
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-page-layout': PageLayout
  }
}
