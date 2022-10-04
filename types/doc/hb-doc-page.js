var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
import "../layout/hb-page-layout";
/**
 *
 */
let HbDocPage = class HbDocPage extends LitElement {
    render() {
        return html `      
            <hb-page-layout>                
                <h1>HB-DOC-PAGE</h1>
                Test document, uid = <span class="primary-text">${this.uid}</span>
                <p>
                    <a href="/bad-link">Bad Link</a>
                </p>
            </hb-page-layout>
        `;
    }
};
HbDocPage.styles = [styles.types, styles.colors, css `
        :host {
            display: block;
        }
  `];
__decorate([
    property({ type: String })
], HbDocPage.prototype, "uid", void 0);
HbDocPage = __decorate([
    customElement('hb-doc-page')
], HbDocPage);
export { HbDocPage };
