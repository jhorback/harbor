import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
import "../layout/hb-page-layout";
import "./data/hb-doc-data";

/**
 * 
 */
@customElement('hb-doc-page')
export class HbDocPage extends LitElement {

    @property({type: String})
    pid!:String;

    render() {
        return html`      
            <hb-page-layout>                
                <h1>HB-DOC-PAGE</h1>
                Test document, pid = <span class="primary-text">${this.pid}</span>
                <p>
                    <a href="/bad-link">Bad Link</a>
                </p>
            </hb-page-layout>
        `
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
