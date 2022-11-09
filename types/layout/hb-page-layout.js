var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import "./hb-user-menu";
import "./hb-app-bar";
/**
 * @class PageLayout
 */
let PageLayout = class PageLayout extends LitElement {
    connectedCallback() {
        super.connectedCallback();
        window.scrollTo({ top: 0, left: 0 });
    }
    render() {
        return html `
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
      `;
    }
    avatarButtonClicked(event) {
        this.$userMenu.open = !this.$userMenu.open;
    }
};
PageLayout.styles = [css `
      :host {
        display: block;
      }
      .page-layout {
        max-width: 750px;
        margin: auto;
        padding: 1rem;
      }
      :host([small]) .page-layout {
        max-width: 80ch;
      }
      :host([large]) .page-layout {
        max-width: 840px;
      }
    `];
__decorate([
    query("hb-user-menu")
], PageLayout.prototype, "$userMenu", void 0);
PageLayout = __decorate([
    customElement('hb-page-layout')
], PageLayout);
export { PageLayout };
