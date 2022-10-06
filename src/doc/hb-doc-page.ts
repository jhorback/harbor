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
@customElement('hb-doc-page')
export class HbDocPage extends LitElement {

    docType:string = docTypes.doc.type;

    @property({type: String})
    pid!:String;

    get uid() { return `${this.docType}:${this.pid}`; }

    @property({type: Object, attribute: false})
    state = DocData.defaultState;

    @state()
    inEditMode = false;

    render() {
        return html`
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

    static styles = [styles.types, styles.colors, css`
        :host {
            display: block;
        }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-doc-page': HbDocPage
  }
}
