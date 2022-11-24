import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { UserMenu } from "./hb-user-menu";
import "./hb-user-menu";
import "./hb-app-bar";
import { AvatarButtonClickedEvent } from "./hb-avatar-button";



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
        <div class="page-layout">
          <slot></slot>
        </div>
      `
    }

    avatarButtonClicked(event:AvatarButtonClickedEvent) {
      this.$userMenu.open = !this.$userMenu.open;
    }

    static styles = [css`
      :host {
        display: block;
      }
      :host([small]) .page-layout {
        max-width: 80ch;
      }
      :host([medium]) .page-layout,
      .page-layout {
        max-width: 750px;
        margin: auto;
        padding: 1rem;
      }
      :host([large]) .page-layout {
        max-width: 840px;
      }
      :host([wide]) .page-layout {
        max-width: 1200px;
      }
      :host([full]) .page-layout {
        max-width: 100%;
      }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-page-layout': PageLayout
  }
}
