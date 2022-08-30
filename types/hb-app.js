var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { styles } from "./styles";
import "./layout/hb-page-layout";
// testing
import { FbApp } from "./domain/FbApp";
import { GoogleAnalytics } from "./domain/GoogleAnalytics";
import { signin } from "./domain/GoogleAuth";
// init
FbApp.current;
GoogleAnalytics.current;
console.log(FbApp.current, GoogleAnalytics.current);
signin();
/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
let HarborApp = class HarborApp extends LitElement {
    render() {
        return html `      
      <hb-page-layout>
        <div class="content">
          <h1>HB-APP</h1>
        </div>
      </hb-page-layout>
    `;
    }
    static { this.styles = [styles.types, styles.icons, css `
    :host {
      display: block;
    }
    .content {
      max-width: 750px;
      margin: auto;
      padding: 1rem;
    }
  `]; }
};
HarborApp = __decorate([
    customElement('hb-app')
], HarborApp);
export { HarborApp };
