var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles, typeStylesDisplayLarge } from "./styles/typeStyles";
import { iconStyles } from "./styles/iconStyles";
import "./common/hb-avatar";
import "./hb-style-guide";
// import litLogo from "./assets/lit.svg"
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
let HarborApp = class HarborApp extends LitElement {
    constructor() {
        super(...arguments);
        /**
         * Copy for the read the docs hint.
         */
        this.docsHint = 'Click on the Vite and Lit logos to learn more';
        /**
         * The number of times the button has been clicked.
         */
        this.count = 0;
    }
    render() {
        return html `      
      <slot></slot>
      <span class="material-symbols-outlined">settings</span>
      <hb-avatar href="content/avatars/user1.png"></hb-avatar>
      <hb-style-guide></hb-style-guide>
    `;
    }
};
HarborApp.styles = [typeStyles, iconStyles, css `
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
    ::slotted(h1) {
      ${typeStylesDisplayLarge}
    }


  `];
__decorate([
    property()
], HarborApp.prototype, "docsHint", void 0);
__decorate([
    property({ type: Number })
], HarborApp.prototype, "count", void 0);
HarborApp = __decorate([
    customElement('hb-app')
], HarborApp);
export { HarborApp };
