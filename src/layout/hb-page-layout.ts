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
        --hb-page-layout-small: 760px;
        --hb-page-layout-medium: 930px;
        --hb-page-layout-large: 996px;
        --hb-page-layout-wide: 1769px;
        --hb-page-layout-full: 100%;
      }
      :host([small]) .page-layout,
      :host([size=small]) .page-layout {
        max-width: var(--hb-page-layout-small);
      }
      :host([medium]) .page-layout,
      :host([size=medium]) .page-layout,
      .page-layout {
        max-width: var(--hb-page-layout-medium);
        margin: auto;
        padding: 1rem;
      }
      :host([large]) .page-layout,
      :host([size=large]) .page-layout {
        max-width: var(--hb-page-layout-large);
      }
      :host([wide]) .page-layout,
      :host([size=wide]) .page-layout {
        max-width: var(--hb-page-layout-wide);
      }
      :host([full]) .page-layout,
      :host([size=full]) .page-layout {
        max-width: var(--hb-page-layout-full);
      }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-page-layout': PageLayout
  }
}
