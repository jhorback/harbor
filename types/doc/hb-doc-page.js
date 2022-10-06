var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "../styles";
import { docTypes } from "../domain/Doc/docTypes";
import "../layout/hb-page-layout";
import { DocData } from "./data/hb-doc-data";
import { linkProp } from "@domx/dataelement";
/**
 *
 */
let HbDocPage = class HbDocPage extends LitElement {
    constructor() {
        super(...arguments);
        this.docType = docTypes.doc.type;
        this.state = DocData.defaultState;
        this.inEditMode = false;
    }
    get uid() { return `${this.docType}:${this.pid}`; }
    render() {
        return html `
            <hb-doc-data
                uid=${this.uid}
                @state-changed=${linkProp(this, "state")}
            ></hb-doc-data>     
            <hb-page-layout>
                <div slot="app-bar-buttons" ?hidden=${!this.showButtons()}>
                    HELLO
                </div>
                <h1>HB-DOC-PAGE : ${this.state.doc.title}</h1>
                Test document, pid = <span class="primary-text">${this.pid}</span>
                uid = <span class="primary-text">${this.uid}</span>
                <p>
                    <a href="/bad-link">Bad Link</a>
                    <a href="/docs/foo-bar-baz">Bad Docs Link</a>
                </p>
            </hb-page-layout>
        `;
    }
    showButtons() {
        return this.inEditMode; // && user is authorized
    }
};
HbDocPage.styles = [styles.types, styles.colors, css `
        :host {
            display: block;
        }
  `];
__decorate([
    property({ type: String })
], HbDocPage.prototype, "pid", void 0);
__decorate([
    property({ type: Object, attribute: false })
], HbDocPage.prototype, "state", void 0);
__decorate([
    state()
], HbDocPage.prototype, "inEditMode", void 0);
HbDocPage = __decorate([
    customElement('hb-doc-page')
], HbDocPage);
export { HbDocPage };
