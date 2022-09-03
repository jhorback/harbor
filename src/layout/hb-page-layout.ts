import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { UserMenu } from "./hb-user-menu";
import "./hb-user-menu";
import "./hb-app-bar";



/**
 * @class PageLayout
 */
@customElement('hb-page-layout')
export class PageLayout extends LitElement {

    @query("hb-user-menu")
    $userMenu!: UserMenu;

    connectedCallback() {
      super.connectedCallback();
      window.scrollTo({ top: 0, left: 0 });
    }

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
